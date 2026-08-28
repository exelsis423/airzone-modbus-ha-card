class AirzoneThermostatCard extends HTMLElement {

  setConfig(config) {
    if (!config.entity) {
      throw new Error("L'entité est obligatoire");
    }

    this.config = config;

    if (!this.content) {
      this.attachShadow({ mode: "open" });
      this.content = document.createElement("ha-card");
      this.shadowRoot.appendChild(this.content);
    }

    this.render();
  }

  set hass(hass) {
    this._hass = hass;
    this.render();
  }

  render() {
    if (!this._hass || !this.config) {
      return;
    }

    const entity = this._hass.states[this.config.entity];

    if (!entity) {
      this.content.innerHTML = `
        <div style="padding: 16px;">
          Entité introuvable : ${this.config.entity}
        </div>
      `;
      return;
    }

    this.content.innerHTML = `
      <style>
        ha-card {
          overflow: hidden;
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
      </style>

      <div class="thermostat">
        <img src="https://raw.githubusercontent.com/exelsis423/airzone-modbus-ha-card/main/images/airzone-thermostat-lite.jpg">
      </div>
    `;
  }

  getCardSize() {
    return 4;
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
  description: "Carte thermostat Airzone Modbus",
  preview: true,
});
