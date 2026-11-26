# EcoFlow Delta 3 Max — local Bluetooth control page

A single HTML file that reads and changes the settings of an EcoFlow Delta 3 Max
power station over Bluetooth LE, straight from the browser. No EcoFlow app, no
cloud, no internet connection; nothing leaves your device.

Unofficial. Not affiliated with or endorsed by EcoFlow. Use on hardware you own,
at your own risk.

## What it does

- **Live status:** battery level, input/output power per port, time to full/empty,
  battery temperature, error codes.
- **Outputs:** AC, 12V DC, USB, X-Boost.
- **Settings:** charge and discharge limits, backup reserve, AC charge mode and
  speed, grid bypass, unit / AC / 12V auto-off timers, output memory, beeper,
  screen timeout and brightness.
- **Diagnostics:** a read-only dump of every value the unit reports, with serial
  numbers masked.

## Requirements

- A browser with Web Bluetooth: Chrome or Edge on desktop or Android. On
  iPhone/iPad use a Web Bluetooth browser such as Bluefy.
- A Delta 3 Max that has already been bound to an EcoFlow account, and that
  account's numeric **User ID** plus the unit's **serial number**. The unit checks
  both on every connection.

## Use it online

Open **<https://jlnt.github.io/misc-projects/ecoflow-delta3max-ble/>**.

The hosted page contains no credentials. Type your User ID and serial number in,
or pick your own credentials file with **Load credentials file…**. Everything
still runs in your browser: the values are never sent to GitHub or anywhere else.

The page shows its version under the title, and offers to update itself when a
newer one has been published.

### Install it as an app (Android)

Open the link above in Chrome, then choose **Install app** (or **Add to Home
screen**) from Chrome's menu. It then opens full-screen from its own icon, and
after the first visit it loads with no internet connection — useful during a
power outage. Enter your credentials and connect once; the browser remembers
them on that phone. Chrome still asks you to pick the unit each time you connect.

## Use it from a local copy

1. Download `ecoflow-delta3max.html`.
2. Copy `ecoflow-credentials.example.js` to `ecoflow-credentials.js` in the same
   folder and fill in your User ID and serial number. The page loads it
   automatically. Alternatively, type the values into the page and press
   **Save credentials file** to have it write the file for you.
3. Open the page, close the EcoFlow app (the unit accepts one Bluetooth
   connection at a time) and press **Connect**.

## Credentials

Keep `ecoflow-credentials.js` private: anyone with those two values and
Bluetooth range can control the unit. The page also remembers the values in the
browser after connecting; **Forget saved values** clears them.

## Connecting

The page retries a failed connection by itself, up to six times, and the
**Connect** button turns into **Cancel** while it does. Chrome on Android often
needs several of those tries — roughly one attempt in three got through on the
phone it was tested with — so connecting there can take up to a minute. Desktop
Chrome and ChromeOS normally connect first time.

## Status

Tested against one US Delta 3 Max (serial prefix `D3N1`). Reading settings and
the controls shared with ha-ef-ble are confirmed on that unit. Some newer
controls (auto-off timers, screen brightness, output memory, charge mode) come
from the protocol definition only: each one is read back from the unit, so if a
control snaps back after **Refresh current settings**, the unit ignored it.

Other Delta 3 family models speak the same protocol but are untested.

## Credits

The protocol implementation is based on
[rabits/ha-ef-ble](https://github.com/rabits/ha-ef-ble) (Apache-2.0).

## License

Apache License 2.0 — see [LICENSE](../LICENSE).
