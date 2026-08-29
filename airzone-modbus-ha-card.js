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
      container-type: inline-size;
    }

    .thermostat img {
      display: block;
      width: 100%;
      height: auto;
    }

    /*
     * Nom de la zone
     */

    .zone-name {
      position: absolute;
      top: 4%;
      left: 50%;
      transform: translateX(-50%);

      font-size: clamp(12px, 4.5cqw, 22px);
      font-weight: 500;
      text-align: center;

      white-space: nowrap;
    }

    /*
     * Température + humidité
     */

    .info-line {
      position: absolute;
      top: 10%;
      left: 8%;
      right: 8%;

      display: flex;
      justify-content: space-between;
      align-items: center;

      font-size: clamp(11px, 5cqw, 20px);
      font-weight: 500;
    }

    /*
     * Éléments interactifs
     */

    .clickable {
      cursor: pointer;
      user-select: none;
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
     * Zones de clic de l'offset
     *
     * Pour l'instant elles sont visibles afin
     * de pouvoir ajuster facilement leur position.
     */

    .offset-click-zone {
      position: absolute;

      top: 0;
      width: 28px;
      height: 40px;

      border: 1px dashed currentColor;
      border-radius: 6px;

      background: rgba(128, 128, 128, 0.15);

      box-sizing: border-box;
    }

    /*
     * Zone gauche = diminution de l'offset
     */

    .offset-click-zone.left {
      left: -30px;
    }

    /*
     * Zone droite = augmentation de l'offset
     */

    .offset-click-zone.right {
      right: -30px;
    }

    /*
     * LED thermostat
     */

    .led-status {
      position: absolute;
      right: 8%;
      bottom: 8%;

      display: flex;
      align-items: center;
      justify-content: center;

      font-size: clamp(14px, 5cqw, 24px);
    }

    .led-icon {
      width: 1em;
      height: 1em;

      border-radius: 50%;
      background: currentColor;

      box-shadow:
        0 0 0.15em currentColor,
        0 0 0.35em currentColor;
    }

    .led-off {
      opacity: 0.25;
      box-shadow: none;
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

  /*
   * Ouvre la boîte More Info de Home Assistant
   */

  _showMoreInfo(entityId) {
    if (!this.hass || !entityId) {
      return;
    }

    const event = new Event("hass-more-info", {
      bubbles: true,
      composed: true,
    });

    event.detail = {
      entityId: entityId,
    };

    this.dispatchEvent(event);
  }

  render() {
    if (!this.hass || !this.config) {
      return html``;
    }

    const zone = this.config.zone;

    /*
     * Entités de la zone
     */

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

    /*
     * Vérification de la zone
     */

    if (!nameEntity) {
      return html`
        <ha-card>
          <div style="padding: 16px;">
            Zone ${zone} introuvable
          </div>
        </ha-card>
      `;
    }

    /*
     * Nom
     */

    const name =
      this.config.name ||
      nameEntity.state ||
      `Zone ${zone}`;

    /*
     * Température
     */

    const temperature =
      temperatureEntity?.state !== undefined
        ? `${temperatureEntity.state} °C`
        : "";

    /*
     * Humidité
     */

    const humidity =
      humidityEntity?.state !== undefined
        ? `${humidityEntity.state} %`
        : "";

    /*
     * Offset
     */

    const offset =
      offsetEntity?.state !== undefined
        ? Number(offsetEntity.state)
        : 0;

    /*
     * LED
     */

    const ledOn =
      ledEntity?.state === "on";

    return html`
      <ha-card>

        <div class="thermostat">

          <!-- Image du thermostat -->

          <img
            src="https://raw.githubusercontent.com/exelsis423/airzone-modbus-ha-card/main/images/airzone-thermostat-lite.jpg"
          >

          <!-- Nom -->

          <div class="zone-name">
            ${name}
          </div>

          <!-- Température + humidité -->

          <div class="info-line">

            <span
              class="clickable"
              @click=${() =>
                this._showMoreInfo(
                  `sensor.airzone_zone_${zone}_temperature_sonde`
                )}
            >
              ${temperature}
            </span>

            <span
              class="clickable"
              @click=${() =>
                this._showMoreInfo(
                  `sensor.airzone_zone_${zone}_humidite`
                )}
            >
              ${humidity}
            </span>

          </div>

          <!-- Offset -->

          <div class="offset-line">

            <!-- ZONE DE CLIC GAUCHE -->

            <div
              class="offset-click-zone left clickable"
              @click=${() => console.log("OFFSET -1")}
            ></div>

            <!-- ZONE DE CLIC DROITE -->

            <div
              class="offset-click-zone right clickable"
              @click=${() => console.log("OFFSET +1")}
            ></div>

            <!-- Barres -->

            <div class="offset-bars">

              <!-- -3 -->

              ${offset <= -3
                ? html`
                    <span
                      class="offset-bar down large"
                    ></span>
                  `
                : ""}

              <!-- -2 -->

              ${offset <= -2
                ? html`
                    <span
                      class="offset-bar down medium"
                    ></span>
                  `
                : ""}

              <!-- -1 -->

              ${offset <= -1
                ? html`
                    <span
                      class="offset-bar down small"
                    ></span>
                  `
                : ""}

              <!-- +1 -->

              ${offset >= 1
                ? html`
                    <span
                      class="offset-bar up small"
                    ></span>
                  `
                : ""}

              <!-- +2 -->

              ${offset >= 2
                ? html`
                    <span
                      class="offset-bar up medium"
                    ></span>
                  `
                : ""}

              <!-- +3 -->

              ${offset >= 3
                ? html`
                    <span
                      class="offset-bar up large"
                    ></span>
                  `
                : ""}

            </div>

          </div>

          <!-- LED thermostat -->

          ${ledEntity
            ? html`
                <div
                  class="led-status clickable"
                  @click=${() =>
                    this._showMoreInfo(
                      `switch.airzone_zone_${zone}_led_thermostat`
                    )}
                >
                  <span
                    class="led-icon ${ledOn
                      ? ""
                      : "led-off"}"
                  ></span>
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

