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

    const entity = this.hass.states[this.config.entity];

    if (!entity) {
      return html`
        <ha-card>
          <div style="padding: 16px;">
            Entité introuvable : ${this.config.entity}
          </div>
        </ha-card>
      `;
    }

    return html`
      <ha-card>
        <div class="thermostat">

          <img
            src="https://raw.githubusercontent.com/exelsis423/airzone-modbus-ha-card/main/images/airzone-thermostat-lite.jpg"
          >

          <div class="zone-name">
            ${this.config.name || entity.attributes.friendly_name || "Zone"}
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
