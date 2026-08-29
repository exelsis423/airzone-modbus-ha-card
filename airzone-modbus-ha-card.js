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

    .zone-info {
      position: absolute;
      top: 12%;
      left: 5%;
      right: 5%;

      display: flex;
      justify-content: space-between;
      align-items: center;

      font-size: 16px;
      font-weight: 500;
    }

    .temperature {
      text-align: left;
    }

    .humidity {
      text-align: right;
    }
  `;

  setConfig(config) {
    if (!config.entity) {
      throw new Error("L'entité est obligatoire");
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

    /*
     * L'entité configurée sert uniquement à déterminer la zone.
     *
     * Exemple :
     * switch.airzone_zone_1_etat
     *
     * => zone = 1
     */
    const match = this.config.entity.match(
      /airzone_zone_(\d+)_/
    );

    if (!match) {
      return html`
        <ha-card>
          <div style="padding: 16px;">
            Entité Airzone invalide
          </div>
        </ha-card>
      `;
    }

    const zone = match[1];

    const stateEntity =
      this.hass.states[
        `switch.airzone_zone_${zone}_etat`
      ];

    const temperatureEntity =
      this.hass.states[
        `sensor.airzone_zone_${zone}_temperature_sonde`
      ];

    const humidityEntity =
      this.hass.states[
        `sensor.airzone_zone_${zone}_humidite`
      ];

    if (!stateEntity) {
      return html`
        <ha-card>
          <div style="padding: 16px;">
            Zone Airzone introuvable : ${zone}
          </div>
        </ha-card>
      `;
    }

    const zoneName =
      this.config.name ||
      this.hass.states[
        `sensor.airzone_zone_${zone}_nom`
      ]?.state ||
      `Zone ${zone}`;

    const temperature =
      temperatureEntity?.state ?? "—";

    const humidity =
      humidityEntity?.state ?? "—";

    return html`
      <ha-card>
        <div class="thermostat">

          <img
            src="https://raw.githubusercontent.com/exelsis423/airzone-modbus-ha-card/main/images/airzone-thermostat-lite.jpg"
          >

          <div class="zone-name">
            ${zoneName}
          </div>

          <div class="zone-info">

            <div class="temperature">
              ${temperature} °C
            </div>

            <div class="humidity">
              ${humidity} %
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
