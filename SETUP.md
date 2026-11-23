# Northwind server — SETUP.md

How the Northwind server, its two environments (staging and production) and its delivery pipeline are built, in order. Each step says **what** it is, **why** it exists, and **how to check** it worked. Commands are added during the rebuild.

---

## 1. Droplet

**What:** a DigitalOcean droplet (VPS): Ubuntu 24.04 LTS, 1 vCPU, 512 MB RAM, 10 GB disk, $4/month flat, region LON1. Monitoring ticked at creation (installs the free metrics agent). IPv4 only.

**SSH key, made before the droplet:** generate an **ed25519** key pair on the laptop. It creates a **private** key (`~/.ssh/id_ed25519`, protected by a passphrase) and a **public** key (`id_ed25519.pub`). Paste the **public** key into DigitalOcean when creating the droplet; it is installed for `root`.

**Why:** the public key is safe to share; only the private key can use it, so the private key never leaves the laptop.

**Shortcut:** an entry in the laptop's `~/.ssh/config` gives the server a nickname (`northwind`) with its IP, user, key file and a keep-alive (`ServerAliveInterval`) so idle sessions aren't dropped.

**Check:** `ssh northwind` logs in. The first connection asks to trust the server's host key, which is then saved in `known_hosts`.

---

## 2. System update

**What:** refresh the package list, then install all available updates.

**Why:** a fresh image is weeks old and missing security patches. Patch before installing anything.

**Check:** a second upgrade run reports nothing left to install.

---

## 3. Swap (1 GB)

**What:** a 1 GB file on disk used as overflow memory. File mode **600**. Appended to `/etc/fstab` so it survives reboots — appended, never overwriting the file.

**Why:** 512 MB RAM now runs two Node apps plus nginx. When RAM fills, Linux moves idle memory pages to swap instead of the OOM killer ending a process. Swap is ~100× slower than RAM — a safety net, not extra speed. Mode 600 because memory contents, secrets included, can be written into it.

**Check:** `free -h` shows a Swap row of 1.0 Gi. Read memory by the **available** column, not **free**.

---

## 4. Firewall (ufw)

**What:** default deny incoming, allow outgoing; allow only SSH (22), HTTP (80), HTTPS (443).

**Why:** only the doors that must be open are open. The app ports (3000, 3001) are never reachable from outside. Allow SSH **before** enabling, or the current session is cut off (recovery: DigitalOcean's web console). ufw is stateful: replies to allowed connections come back automatically.

**Check:** `ufw status verbose` lists exactly 22, 80, 443.

---

## 5. Users

| User | Purpose | Login | Privileges |
|---|---|---|---|
| `johnson` | the human admin, used instead of root | SSH key; home dir; bash | full sudo (asks johnson's password) |
| `deploy` | the CI/CD pipeline | its own SSH key; home dir; bash | **two** sudo rules: restart `northwind`, restart `northwind-staging` |
| `northwind` | **runs** the production app | none (system user, no home, `nologin`) | none |
| `northwind-staging` | **runs** the staging app | none (system user, no home, `nologin`) | none |

**Why separate users:** each is a separate "if this is stolen" story, and each should end small.
- If an app is compromised, the attacker is `northwind` or `northwind-staging`: it can **read** its code but not change it (`deploy` owns it), has no shell and no sudo, and cannot touch the other environment.
- If the deploy key leaks, the attacker can ship a release and restart the apps, but can't take over the server.
- `johnson` can do everything, so it needs the SSH key (with its passphrase) **and** a password for sudo.

**Check:** `getent passwd johnson deploy northwind northwind-staging` — last fields are `/bin/bash`, `/bin/bash`, `/usr/sbin/nologin`, `/usr/sbin/nologin`.

---

## 6. SSH hardening

**What:** copy root's `authorized_keys` to `johnson` (folder 700, file 600, owned by johnson). Then, in `/etc/ssh/sshd_config.d/00-hardening.conf`: `PermitRootLogin no` and `PasswordAuthentication no`. The `00-` prefix matters: the first value read wins.

**Why:** daily work goes through a named user, never root. Keys only — no passwords to guess.

**Check:** test the new login **before** closing the root session. `sshd -T` shows the settings SSH actually uses. `ssh root@<ip>` returns `Permission denied (publickey)`.

---

## 7. Node.js 22

**What:** install Node from NodeSource's 22.x source (Ubuntu's own package is Node 18).

**Why:** the server must run the **same major version** CI tests on (`.nvmrc` = 22); a different version means production runs code nothing tested. TypeScript and Vite are not installed: they only run in CI.

**Check:** `node -v` prints `v22.x.x`.

---

## 8. Release folders

**What:** one folder per release, plus a `current` symlink pointing at the live one — for each environment:

| | Releases | Live pointer | Releases kept |
|---|---|---|---|
| Production | `/opt/northwind/releases/<sha>/` | `/opt/northwind/current` | newest 5 |
| Staging | `/opt/northwind-staging/releases/<sha>/` | `/opt/northwind-staging/current` | newest 1 |

Owned by `deploy` — **including the parent folder** (`/opt/northwind`, `/opt/northwind-staging`), mode 755. The app users can only read.

**Why:** a rollback is repointing `current` and restarting — seconds, no rebuild. The pipeline swaps `current` **atomically**: it builds a new link (`current.tmp`) and renames it over `current`, so there is never a moment with no `current`. Creating and renaming a link happens inside the parent folder, which is why `deploy` must own the parent. Old releases are deleted on each deploy, or the 10 GB disk fills (~78 MB per release).

**Check:** `namei -l /opt/northwind/current/server.js` walks the whole path; `readlink /opt/northwind/current` shows which release is live.

---

## 9. Environment files

**What:** one settings file per environment. Owner `root`, group = the app user, mode **640**.

| | File | Contents |
|---|---|---|
| Production | `/etc/northwind/northwind.env` | `PORT=3000`, `NODE_ENV=production` |
| Staging | `/etc/northwind-staging/staging.env` | `PORT=3001`, `NODE_ENV=production` |

One `KEY=value` per line: no spaces, no quotes, no `;`.

**Who uses it:** systemd reads it (as root, before switching user) and passes each line to Node as an environment variable. The developer's code reads `process.env.PORT` once, at startup.

**Why:**
- Settings live on the server, not in the code, so the same release runs in both environments.
- **The port separates the environments**; two apps can't share one port (`EADDRINUSE`).
- **Staging uses `NODE_ENV=production`** because libraries switch behaviour on that exact word; staging must run the same code path production will.
- Root owns the file, so a compromised app can't rewrite its own settings. `deploy` can't read it.
- The release name (`RELEASE`) is **not** here: each release carries its own `release.env`, written by CI.

**Check:** `sudo -u northwind cat` the production file succeeds; `sudo -u deploy cat` is denied. Same pattern for staging.

---

## 10. systemd services

**What:** two units, identical in shape:

| | Unit | Runs as | Working directory |
|---|---|---|---|
| Production | `/etc/systemd/system/northwind.service` | `northwind` | `/opt/northwind/current` |
| Staging | `/etc/systemd/system/northwind-staging.service` | `northwind-staging` | `/opt/northwind-staging/current` |

Each one:
- runs `/usr/bin/node <current>/server.js`;
- loads its environment file, then the release's own `release.env` (optional, marked with `-`); a value read later wins;
- restarts the app if it crashes (`Restart=on-failure`, after 2 seconds);
- starts at boot (`WantedBy=multi-user.target`).

Staging also has **`MemoryMax=200M`**: if it leaks memory, systemd kills only staging, never production.

**Why:** the apps run without anyone logged in, come back after a crash or reboot, and always start from whatever `current` points to. After editing a unit, run daemon-reload. Key names are case-sensitive: a misspelled key (`user=`) is ignored with a warning, and the app silently runs as root.

**Check:** `systemctl status <unit>` shows `active (running)`. `systemctl show <unit> -p User` shows the user systemd actually loaded. `ps -o user,pid,cmd -C node` shows who each Node process runs as.

---

## 11. nginx

**What:** nginx is the only thing facing the internet; Node stays on `127.0.0.1`. Two site files in `sites-available/`, each **enabled by a symlink** in `sites-enabled/`; the default site's link removed. `server_tokens off` in `nginx.conf`'s `http {}` block hides the nginx version everywhere.

**`northwind` file:**
1. **Catch-alls, one per port:** port 80 `default_server` returns **444** (closes the connection without a reply); port 443 `default_server` uses `ssl_reject_handshake on` (refuses the HTTPS handshake, no certificate needed). Requests by raw IP or an unknown name get nothing on either port. A `default_server` only covers the port it listens on; without the 443 one, nginx falls back to the first 443 block in the file.
2. **www**: permanent redirect (301) to `https://northwind-design.online`, keeping the path.
3. **northwind-design.online** (HTTPS):
   - `root` is the live release's `dist` folder;
   - `/api/` and `= /health` are proxied to `127.0.0.1:3000`, passing `Host`, `X-Real-IP`, `X-Forwarded-For`, `X-Forwarded-Proto`;
   - `/assets/` (fingerprinted files): `Cache-Control: public, max-age=31536000, immutable`, and a missing file is an honest 404;
   - `= /index.html`: `Cache-Control: no-cache`;
   - `/` (everything else): the file if it exists, otherwise `index.html` (React draws the page).

**`northwind-staging` file:** the same HTTPS block for `staging.northwind-design.online`, with `root` in staging's `current/dist` and the proxy to port **3001**.

**Why:**
- nginx chooses a block by port, then `Host` vs `server_name`, else `default_server`.
- Serving `dist` from nginx keeps pages up even when Node is down; only `/api/` returns 502.
- Fingerprinted files change **name** when their content changes, so a one-year cache can never be stale. `index.html` keeps its name and lists the current fingerprints, so browsers must always check it. Pages like `/work` reach the `= /index.html` block through `try_files`' internal redirect, so they get `no-cache` too.
- Without a `Cache-Control` header, browsers guess (about 10% of the file's age), and visitors can be stuck on an old release.

**Check:** `nginx -t` passes, then reload (nginx only reads config at start or reload). `curl -I` on `/`, `/work` and an `/assets/` file shows the expected `Cache-Control`. `curl` by IP → empty reply (444). `nginx -T` shows the full config the next reload will use. `nginx -t` checks syntax only, never header values — `curl -I` is the real check.

---

## 12. DNS and HTTPS

**What:** the domain is registered at Namecheap; its nameservers point to DigitalOcean. In DigitalOcean DNS:
- **A** `@` → the droplet IP;
- **CNAME** `www` → `@`;
- **A** `staging` → the droplet IP (subdomains are free records inside the owned domain).

Low TTL (300 s) while setting up. Then certbot (nginx plugin) for `northwind-design.online`, `www.northwind-design.online` and `staging.northwind-design.online`.

**Why:** Let's Encrypt proves you control a name by visiting it over port 80, so DNS, port 80 and a **loaded** nginx block must all exist first. Certbot adds the HTTPS listener and the HTTP→HTTPS redirect (writing through the `sites-enabled` symlink into the real file). Certificates last 90 days and renew automatically when fewer than 30 are left.

**Check:** `dig <name> +short` returns the droplet IP. `curl -I http://<name>` → `301` to `https://`. `certbot certificates` lists every name with its expiry.

---

## 13. Deploy key, sudo rules and GitHub secrets

**What:**
- A **separate** key pair for the pipeline, no passphrase (CI can't type), labelled `github-actions-deploy`. Public half → `/home/deploy/.ssh/authorized_keys` (folder 700, file 600, owned by deploy). Private half → GitHub secret `DEPLOY_SSH_KEY`.
- Secret `DEPLOY_HOST` = the IP exactly. Secret for known hosts = the server's host-key line from `ssh-keyscan`, after confirming its SHA256 fingerprint matches the server's own.
- Sudo rules, written with `visudo` in `/etc/sudoers.d/northwind-deploy` (no dots in the name): `deploy` may run exactly `systemctl restart northwind` and `systemctl restart northwind-staging` as root, no password.

**On a rebuild (same IP, fresh install):** the server gets new host keys, so the pipeline fails with `Host key verification failed`, and the laptop warns too. This is expected, not an attack, but it must be **proven** before trusting the new key: take the fingerprint from `ssh-keyscan` (outside) and the fingerprint read on the server through the **DigitalOcean web console** (a path an attacker can't fake), and only if they match, update the known-hosts secret and remove the old line from the laptop's `known_hosts`. Never trust a new key over the connection being questioned.

**Why:** the pipeline gets exactly the access it needs and nothing more. A sudoers rule allows only the exact command and arguments listed. `visudo` checks syntax before saving; a broken sudoers file locks everyone out of sudo. The known-hosts secret lets the runner verify the server instead of trusting whatever answers. A misnamed secret is silently empty.

**Check:** `ssh -i <deploy key> deploy@<ip> whoami` → `deploy`. `sudo -l -U deploy` lists exactly the two rules. `sudo whoami` as deploy is refused.

---

## 14. GitHub repository settings

**What:**
- **Ruleset on `main`:** pull request required; required status checks `lint`, `test`, `build`; branches must be up to date; force pushes and deletion blocked; empty bypass list.
- **Environment `production`:** required reviewer = the repo owner; "prevent self-review" **off** (a solo repo would deadlock).
- **`.github/CODEOWNERS`:** the owner owns `/.github/` (workflows and CODEOWNERS itself), `/package*.json` and `/.nvmrc`. "Require review from Code Owners" stays **off** while the repo has one person.

**Why:** nobody, the owner included, can push untested code to `main`. Production only changes after a human looks at staging (continuous **delivery**). CODEOWNERS makes changes to the pipeline, the runtime version and the dependencies visible to whoever runs production.

**Check:** a direct push to `main` is rejected (`GH013`). A merged PR shows the deploy job "Waiting for review". The CODEOWNERS file on GitHub shows no error banner.

---

## 15. Pipeline (`.github/workflows/ci.yml`)

**What:** runs on every pull request and every push to `main`. Actions pinned by commit SHA; token permissions `contents: read`; one run per branch at a time.

| Job | Runs on | Does |
|---|---|---|
| `lint` → `test` → `build` | PRs and `main` | install with `npm ci`, check, test, build. On `main` only: drop dev packages, write `release.env`, pack **one** tarball and upload it |
| `staging` | `main` only, after build | download the tarball, stream it into a new staging release folder, atomic swap, restart staging, smoke tests, keep the newest 1 |
| `deploy` | `main` only, after staging, **after approval** | download the **same** tarball, copy and extract it into a new production release folder, atomic swap, restart, smoke tests, keep the newest 5 |

**Smoke tests (both environments):** `/health` must report the exact commit SHA just merged, and an unknown page must return the site's `index.html` (`<div id="root">`), proving nginx's `root`/`try_files` work as well as Node.

**Why:** the release is built once and the same bytes run in staging and production. A green run means the merged commit is live, not just that something answered.

**Check:** after a merge, staging's `/health` shows the merge-commit SHA; after approval, production's does too.

---

## 16. Rollback (`.github/workflows/rollback.yml`)

**What:** a workflow started by hand (`workflow_dispatch`) with one input: the full SHA of a release **already on the server**. The input reaches the shell through a job-level `env:` (never pasted into scripts with `${{ }}`). Steps:
1. set up SSH;
2. **input check:** the SHA must be exactly 40 lowercase hex characters (`^[0-9a-f]{40}$`), or the job stops;
3. **activate:** in one remote command — confirm the release's `server.js` exists, then atomic swap, then restart production;
4. **smoke test:** `/health` must report the requested SHA.

**Why:** a rollback in seconds, with no rebuild. The input check blocks typos and command injection. The existence check sits in the same command as the swap, so an empty or wrong value can never point `current` at nothing (this happened once, when `env:` was set on only one step and production went down).

**Check:** run it with a short SHA, an injection string, and a well-formed SHA that isn't on the server — each fails before anything changes. Run it with a real older release — `/health` shows it. Roll forward to the latest release afterwards so production matches `main`. Valid targets: `ls -lt /opt/northwind/releases` on the server, not `git log`.

---

## 17. Monitoring

**What:**
- **Inside (DigitalOcean alert policies, free):** memory > 85% for 5 min, disk > 80% for 5 min, CPU > 90% for 10 min → email.
- **Outside (one DigitalOcean Uptime check — the free allowance is one):** `https://northwind-design.online/health` from four regions; alerts for **down > 2 min** and **SSL expires in < 14 days**.

**Why:** inside warns before users are hurt; outside shows what users actually experience. Durations filter normal blips. The SSL alert catches a silently failing renewal two weeks early.

**Check:** stop the app on purpose → `/api/` returns `502 Bad Gateway` while pages still load from nginx → alert email within minutes → start it → recovered.