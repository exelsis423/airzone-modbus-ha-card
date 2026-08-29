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
     *
     * Les 6 barres ont toutes le même point
     * de départ horizontal.
     */

    .offset-line {
      position: absolute;
      top: 16%;
      left: 50%;
      transform: translateX(-50%);

      display: flex;
      align-items: center;
      justify-content: center;

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

      left: 50%;

      width: 3px;

      background: currentColor;

      border-radius: 2px;

      transform: translateX(-50%);
    }

    /*
     * Barres vers le bas
     *
     * Le point de départ est identique.
     */

    .offset-bar.down.small {
      top: 20px;
      height: 7px;
    }

    .offset-bar.down.medium {
      top: 20px;
      height: 11px;
    }

    .offset-bar.down.large {
      top: 20px;
      height: 15px;
    }

    /*
     * Barres vers le haut
     *
     * Le point de départ est identique.
     */

    .offset-bar.up.small {
      bottom: 20px;
      height: 7px;
    }

    .offset-bar.up.medium {
      bottom: 20px;
      height: 11px;
    }

    .offset-bar.up.large {
      bottom: 20px;
      height: 15px;
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
