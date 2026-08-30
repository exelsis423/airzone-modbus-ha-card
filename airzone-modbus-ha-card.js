import { LitElement, html, css } from "https://unpkg.com/lit?module";

class AirzoneThermostatCard extends LitElement {

  static properties = {
    hass: {},
    config: {},
  };

  static styles = css`
    ha-card {
      background: transparent;
      border: none;
      box-shadow: none;
      border-radius: 0;
      overflow: hidden;
    }

    .thermostat {
      position: relative;
      width: 100%;
      container-type: inline-size;
    }

    .thermostat img {
      display: block;
      width: 100%;
    }

    /*
     * Nom de la zone
     */

    .zone-name {
      position: absolute;
      top: 4%;
      left: 50%;
      transform: translateX(-50%);

      font-size: clamp(12px, 6.5cqw, 40px);
      font-weight: 500;
      text-align: center;

      white-space: nowrap;
    }

    /*
     * Température + humidité
     */

    .info-line {
      position: absolute;
      top: 15%;
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

      top: 43%;
      left: 50%;

      transform: translateX(-50%);

      width: 50cqw;
      height: 13.33cqw;
    }

    .offset-bars {
      position: relative;

      width: 100%;
      height: 100%;
    }

    .offset-bar {
      position: absolute;

      width: 1.4cqw;

      background: currentColor;

      border-radius: 0.5cqw;
    }

    /*
     * Barres vers le bas
     */

    .offset-bar.down.small {
      left: 14.3%;
      top: 50%;

      height: 2.33cqw;
      background: rgba(255, 0, 0, 0.9);
    }

    .offset-bar.down.medium {
      left: 2%;
      top: 50%;

      height: 4cqw;
      background: rgba(255, 0, 0, 0.9);
    }

    .offset-bar.down.large {
      left: -10.3%;
      top: 50%;

      height: 6.5cqw;
      background: rgba(255, 0, 0, 0.9);
    }

    /*
     * Barres vers le haut
     */

    .offset-bar.up.small {
      right: 14.3%;
      bottom: 50%;

      height: 2.33cqw;
      background: rgba(0, 0, 255, 0.9);
    }

    .offset-bar.up.medium {
      right: 2%;
      bottom: 50%;

      height: 4cqw;
      background: rgba(0, 0, 255, 0.9);
    }

    .offset-bar.up.large {
      right: -10.3%;
      bottom: 50%;

      height: 6.5cqw;
      background: rgba(0, 0, 255, 0.9);
    }

    /*
     * Zones de clic de l'offset
     */

    .offset-click-zone {
      position: absolute;

      top: 0;

      width: 23cqw;
      height: 100%;

      border: 0.33cqw dashed rgba(0, 0, 0, 0.23);
      border-radius: 2cqw;

      background: rgba(128, 128, 128, 0.1);

      box-sizing: border-box;

      z-index: 2;
    }

    .offset-click-zone.left {
      left: -10cqw;
    }

    .offset-click-zone.right {
      right: -10cqw;
    }

    /*
     * Anneau central
     */

    .offset-center {
      position: absolute;

      left: 50%;
      top: 50%;

      transform: translate(-50%, -50%);

      width: 12.8cqw;
      height: 12.8cqw;

      border-radius: 50%;

      border: 1.4cqw solid currentColor;

      background: transparent;

      box-sizing: border-box;

      z-index: 3;
    }

    /*
     * Couleur selon l'état de la zone
     */

    .offset-center.off {
      color: rgb(208, 100, 227);
    }

    .offset-center.cooling {
      color: rgb(5, 137, 242);
    }

    .offset-center.heating {
      color: rgb(242, 32, 17);
    }

    /*
     * Machine à l'arrêt
     */

    .offset-center.machine-off {
      animation: ring-blink 2.3s ease-in-out infinite;
    }

    @keyframes ring-blink {
      0%,
      100% {
        opacity: 1;
      }

      50% {
        opacity: 0.1;
      }
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

    /*
     * Blueface
     *
     * Temporaire : emplacement réservé
     */

    .blueface {
      position: relative;
      width: 100%;
    }

    .blueface img {
      display: block;
      width: 100%;
    }
  `;

  setConfig(config) {
    if (config.zone === undefined) {
      throw new Error("Le numéro de zone est obligatoire");
    }

    const thermostat = config.thermostat || "lite";

    if (!["lite", "blueface"].includes(thermostat)) {
      throw new Error(
        "Le thermostat doit être 'lite' ou 'blueface'"
      );
    }

    this.config = {
      ...config,
      thermostat,
    };
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

  /*
   * Modifie l'offset du thermostat
   *
   * direction = -1 → offset -1
   * direction = +1 → offset +1
   */

  async _changeOffset(direction) {
    if (!this.hass || !this.config) {
      return;
    }

    const zone = this.config.zone;

    const entityId =
      `number.airzone_zone_${zone}_offset_thermostat`;

    const entity = this.hass.states[entityId];

    if (!entity) {
      return;
    }

    const currentOffset = Number(entity.state);

    if (Number.isNaN(currentOffset)) {
      return;
    }

    const newOffset =
      Math.max(
        -3,
        Math.min(
          3,
          currentOffset + direction
        )
      );

    /*
     * Rien à faire si on est déjà à la limite.
     */

    if (newOffset === currentOffset) {
      return;
    }

    await this.hass.callService(
      "number",
      "set_value",
      {
        entity_id: entityId,
        value: newOffset,
      }
    );
  }

  /*
   * ============================================================
   * CARTE LITE
   * ============================================================
   */

  _renderLite() {

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
     * État de la zone
     */

    const zoneStateEntity =
      this.hass.states[
        `switch.airzone_zone_${zone}_etat`
      ];

    /*
     * Mode de la zone
     */

    const zoneModeEntity =
      this.hass.states[
        `select.airzone_zone_${zone}_mode`
      ];

    /*
     * Mode de la machine
     */

    const machineModeEntity =
      this.hass.states[
        "select.airzone_mode"
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

    /*
     * ============================================================
     * ÉTAT DE L'ANNEAU CENTRAL
     * ============================================================
     */

    const zoneIsOn =
      zoneStateEntity?.state === "on";

    const zoneMode =
      zoneModeEntity?.state;

    const machineMode =
      machineModeEntity?.state;

    /*
     * Par défaut : zone arrêtée → violet
     */

    let ringState = "off";

    /*
     * Si la zone est allumée,
     * la couleur dépend du mode.
     */

    if (zoneIsOn) {

      if (zoneMode === "Refroidissement") {
        ringState = "cooling";

      } else if (zoneMode === "Chauffage") {
        ringState = "heating";
      }
    }

    /*
     * La machine est considérée à l'arrêt
     * uniquement si son mode vaut "Arrêt".
     */

    const machineIsOff =
      machineMode === "Arrêt";

    /*
     * Construction des classes CSS
     */

    const ringClass = [
      "offset-center",
      ringState,
      machineIsOff ? "machine-off" : "",
      "clickable",
    ]
      .filter(Boolean)
      .join(" ");

    return html`
      <ha-card>

        <div class="thermostat">

          <!-- Image du thermostat -->

          <img
            src="https://raw.githubusercontent.com/exelsis423/airzone-modbus-ha-card/main/images/airzone-lite.png"
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

            <!-- Zone de clic gauche -->

            <div
              class="offset-click-zone left clickable"
              @click=${() =>
                this._changeOffset(-1)}
            ></div>

            <!-- Zone de clic droite -->

            <div
              class="offset-click-zone right clickable"
              @click=${() =>
                this._changeOffset(1)}
            ></div>

            <!-- Anneau central -->

            <div
              class="${ringClass}"
              @click=${() =>
                this._showMoreInfo(
                  `switch.airzone_zone_${zone}_etat`
                )}
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

  /*
```javascript
  /*
   * ============================================================
   * CARTE BLUEFACE
   * ============================================================
   */

  _renderBlueface() {

    return html`
      <ha-card>

        <div class="blueface">

          <img
            src="https://raw.githubusercontent.com/exelsis423/airzone-modbus-ha-card/main/images/airzone-blueface.png"
          >

        </div>

      </ha-card>
    `;
  }



  /*
   * ============================================================
   * RENDU PRINCIPAL
   * ============================================================
   */

  render() {

    if (!this.hass || !this.config) {
      return html``;
    }

    if (this.config.thermostat === "blueface") {
      return this._renderBlueface();
    }

    return this._renderLite();
  }
}

customElements.define(
  "airzone-thermostat-card",
  AirzoneThermostatCard
);

window.customCards =
  window.customCards || [];

window.customCards.push({
  type: "airzone-thermostat-card",
  name: "Airzone Thermostat",
  description: "Thermostat Lite / Blueface",
  preview: true,
});
