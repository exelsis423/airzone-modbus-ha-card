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
