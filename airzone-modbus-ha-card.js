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

    .offset-line {
      position: absolute;
      top: 16%;
      left: 50%;
      transform: translateX(-50%);

      display: flex;
      align-items: center;
      gap: 4px;

      height: 20px;
    }

    .offset-marker {
      display: block;
      width: 3px;
      background: currentColor;
      border-radius: 2px;
    }

    .offset-marker.small {
      height: 7px;
    }

    .offset-marker.medium {
      height: 11px;
    }

    .offset-marker.large {
      height: 15px;
    }

    .offset-center {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: currentColor;
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
      this.hass.states[`sensor.airzone_zone_${zone}_nom`];

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

            ${offset <= -3
              ? html`
                  <span class="offset-marker large"></span>
                `
              : ""}

            ${offset <= -2
              ? html`
                  <span class="offset-marker medium"></span>
                `
              : ""}

            ${offset <= -1
              ? html`
                  <span class="offset-marker small"></span>
                `
              : ""}

            ${offset === 0
              ? html`
                  <span class="offset-center"></span>
                `
              : ""}

            ${offset >= 1
              ? html`
                  <span class="offset-marker small"></span>
                `
              : ""}

            ${offset >= 2
              ? html`
                  <span class="offset-marker medium"></span>
                `
              : ""}

            ${offset >= 3
              ? html`
                  <span class="offset-marker large"></span>
                `
              : ""}

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
