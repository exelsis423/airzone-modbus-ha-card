import { LitElement, html, css } from "https://unpkg.com/lit?module";

class AirzoneThermostatCard extends LitElement {

  static properties = {
    hass: {},
    config: {},
  };

  static styles = css`
    ha-card {
      border-radius: 20px;
      overflow: hidden;
      border: none;
    }

    .thermostat {
      position: relative;
      width: 100%;
    }

    .thermostat img {
      display: block;
      width: 100%;
      height: auto;
    }

    .zone-name {
      position: absolute;
      top: 4%;
      left: 50%;
      transform: translateX(-50%);

      font-size: 18px;
      font-weight: 500;
      text-align: center;

      white-space: nowrap;
    }

    .info-line {
      position: absolute;
      top: 10%;
      left: 8%;
      right: 8%;

      display: flex;
      justify-content: space-between;
      align-items: center;

      font-size: 16px;
      font-weight: 500;
    }

    /*
     * Indicateur d'offset
     */

    .offset-line {
      position: absolute;
      top: 16%;
      left: 50%;
      transform: translateX(-50%);

      width: 60px;
      height: 40px;
    }

    .offset-bars {
      position: relative;

      width: 60px;
      height: 40px;
    }

    .offset-bar {
      position: absolute;

      width: 3px;

      background: currentColor;

      border-radius: 2px;
    }

    /*
     * Barres vers le bas
     */

    .offset-bar.down.small {
      left: 36px;
      top: 20px;
      height: 7px;
    }

    .offset-bar.down.medium {
      left: 31px;
      top: 20px;
      height: 11px;
    }

    .offset-bar.down.large {
      left: 26px;
      top: 20px;
      height: 15px;
    }

    /*
     * Barres vers le haut
     */

    .offset-bar.up.small {
      left: 36px;
      bottom: 20px;
      height: 7px;
    }

    .offset-bar.up.medium {
      left: 31px;
      bottom: 20px;
      height: 11px;
    }

    .offset-bar.up.large {
      left: 26px;
      bottom: 20px;
      height: 15px;
    }

    /*
     * État de la LED du thermostat
     */

    .led-status {
      position: absolute;
      bottom: 5%;
      right: 8%;

      display: flex;
      align-items: center;
      justify-content: center;

      font-size: 20px;
    }

    .led-status ha-icon {
      --mdc-icon-size: 20px;
    }
  `;

  setConfig(config) {
    if (config.zone === undefined) {
      throw new Error("Le numéro de zone est obligatoire");
    }

    this.config = config;
  }

  getCardSize() {
    return 4;
  }

  render() {
    if (!this.hass || !this.config) {
      return html``;
    }

    const zone = this.config.zone;

    const nameEntity =
      this.hass.states[
        `sensor.airzone_zone_${zone}_nom`
      ];

    const temperatureEntity =
      this.hass.states[
        `sensor.airzone_zone_${zone}_temperature_sonde`
      ];

    const humidityEntity =
      this.hass.states[
        `sensor.airzone_zone_${zone}_humidite`
      ];

    const offsetEntity =
      this.hass.states[
        `number.airzone_zone_${zone}_offset_thermostat`
      ];

    const ledEntity =
      this.hass.states[
        `switch.airzone_zone_${zone}_led_thermostat`
      ];

    if (!nameEntity) {
      return html`
        <ha-card>
          <div style="padding: 16px;">
            Zone ${zone} introuvable
          </div>
        </ha-card>
      `;
    }

    const name =
      this.config.name ||
      nameEntity.state ||
      `Zone ${zone}`;

    const temperature =
      temperatureEntity?.state !== undefined
        ? `${temperatureEntity.state} °C`
        : "";

    const humidity =
      humidityEntity?.state !== undefined
        ? `${humidityEntity.state} %`
        : "";

    const offset =
      offsetEntity?.state !== undefined
        ? Number(offsetEntity.state)
        : 0;

    const ledOn =
      ledEntity?.state === "on";

    return html`
      <ha-card>
        <div class="thermostat">

          <img
            src="https://raw.githubusercontent.com/exelsis423/airzone-modbus-ha-card/main/images/airzone-thermostat-lite.jpg"
          >

          <div class="zone-name">
            ${name}
          </div>

          <div class="info-line">
            <span>${temperature}</span>
            <span>${humidity}</span>
          </div>

          <div class="offset-line">

            <div class="offset-bars">

              ${offset <= -3
                ? html`
                    <span class="offset-bar down large"></span>
                  `
                : ""}

              ${offset <= -2
                ? html`
                    <span class="offset-bar down medium"></span>
                  `
                : ""}

              ${offset <= -1
                ? html`
                    <span class="offset-bar down small"></span>
                  `
                : ""}

              ${offset >= 1
                ? html`
                    <span class="offset-bar up small"></span>
                  `
                : ""}

              ${offset >= 2
                ? html`
                    <span class="offset-bar up medium"></span>
                  `
                : ""}

              ${offset >= 3
                ? html`
                    <span class="offset-bar up large"></span>
                  `
                : ""}

            </div>

          </div>

          ${ledEntity
            ? html`
                <div class="led-status">
                  <ha-icon
                    icon="${ledOn
                      ? "mdi:led-on"
                      : "mdi:led-off"}"
                  ></ha-icon>
                </div>
              `
            : ""}

        </div>
      </ha-card>
    `;
  }
}

customElements.define(
  "airzone-thermostat-card",
  AirzoneThermostatCard
);

window.customCards = window.customCards || [];

window.customCards.push({
  type: "airzone-thermostat-card",
  name: "Airzone Thermostat",
  description: "Thermostat Lite Airzone",
  preview: true,
});
