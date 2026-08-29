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
    if (config.zone === undefined) {
      throw new Error("Le numéro de zone est obligatoire");
    }

    this.config = config;
  }

  getCardSize() {
    return 4;
  }

  /**
   * Retourne l'entité correspondant à la zone.
   */
  getEntity(type, name) {
    const entityId =
      `${type}.airzone_zone_${this.config.zone}_${name}`;

    return this.hass.states[entityId];
  }

  render() {
    if (!this.hass || !this.config) {
      return html``;
    }

    // Entité contenant le nom de la zone
    const nameEntity = this.getEntity(
      "sensor",
      "nom"
    );

    // Nom personnalisé dans la configuration,
    // sinon nom fourni par l'intégration,
    // sinon "Zone X".
    const zoneName =
      this.config.name ||
      nameEntity?.state ||
      `Zone ${this.config.zone}`;

    return html`
      <ha-card>
        <div class="thermostat">

          <img
            src="https://raw.githubusercontent.com/exelsis423/airzone-modbus-ha-card/main/images/airzone-thermostat-lite.jpg"
          >

          <div class="zone-name">
            ${zoneName}
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

