import { LitElement, html, css } from "https://unpkg.com/lit?module";

class AirzoneThermostatCard extends LitElement {

  static properties = {
    hass: {},
    config: {},
    bluefaceDialog: {},
    liteDialog: {},
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
      top: 51%;

      transform: translate(-50%, -50%);

      width: 14cqw;
      height: 14cqw;

      border-radius: 50%;

      border: 1.8cqw solid currentColor;

      background: transparent;

      box-sizing: border-box;

      z-index: 3;
    }

    /*
     * Couleur selon le mode de la MACHINE
     *
     * Arrêt           -> violet
     * Refroidissement -> bleu
     * Chauffage       -> rouge
     * Ventilation     -> bleu
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
     * Machine / zone à l'arrêt :
     * le clignotement dépend de L'ÉTAT DE LA ZONE,
     * pas du mode de la machine.
     */

    .offset-center.zone-off {
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
     * État ON / OFF de la zone
     */

    .zone-state {
      position: absolute;

      left: 50%;
      top: 57%;

      transform: translateX(-50%);

      font-size: clamp(10px, 9cqw, 50px);
      font-weight: 600;

      text-align: center;

      cursor: pointer;
      user-select: none;

      white-space: nowrap;
    }

    /*
     * OFF est volontairement discret
     */

    .zone-state.off {
      color: rgba(128, 128, 128, 0.55);
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

      background: rgb(242, 63, 233);

      box-shadow:
        0 0 0.15em currentColor,
        0 0 0.35em currentColor;
    }

    .led-off {
      opacity: 0.25;
      box-shadow: none;
    }

    /*
     * ============================================================
     * ACTION GLOBALE DE LA CARTE
     * ============================================================
     */

    .card-tap-action {
      position: absolute;

      inset: 0;

      z-index: 100;

      cursor: pointer;
    }

    /*
     * ============================================================
     * BLUEFACE
     * ============================================================
     */

    .blueface {
      position: relative;
      width: 100%;
      container-type: inline-size;
    }

    .blueface img {
      display: block;
      width: 100%;
    }

    /*
     * Température Blueface
     */

    .blueface-temperature {
      position: absolute;

      left: 50%;
      top: 50%;

      transform: translate(-50%, -50%);

      color: white;

      font-size: clamp(16px, 15cqw, 64px);
      font-weight: 500;

      white-space: nowrap;

      text-align: center;

      cursor: pointer;
      user-select: none;
    }

    /*
     * Commandes Blueface
     */

    .blueface-controls {
      position: absolute;

      left: 50%;
      top: 10%;

      transform: translateX(-50%);

      width: 60%;

      display: flex;
      justify-content: center;
      align-items: flex-start;

      gap: 12cqw;
    }

    .blueface-control {
      display: flex;
      flex-direction: column;
      align-items: center;

      cursor: pointer;
      user-select: none;

      color: white;
    }

    .blueface-label {
      margin-bottom: 1cqw;

      font-size: clamp(9px, 7cqw, 34px);
      font-weight: 500;

      color: white;
    }

    .blueface-icon {
      width: 14cqw;
      height: 14cqw;

      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: 50%;

      background: rgba(255, 255, 255, 0.15);

      color: white;

      transition:
        transform 0.15s ease,
        background 0.15s ease;
    }

    .blueface-control:hover .blueface-icon {
      transform: scale(1.08);
      background: rgba(255, 255, 255, 0.25);
    }

    .blueface-icon ha-icon {
      --mdc-icon-size: 14cqw;
      color: white;
    }

    /*
     * ============================================================
     * DIALOGUES
     * ============================================================
     */

    .blueface-dialog-overlay {
      position: fixed;

      inset: 0;

      display: flex;
      align-items: center;
      justify-content: center;

      background: rgba(0, 0, 0, 0.45);

      z-index: 1000;
    }

    .blueface-dialog {
      width: min(90vw, 420px);

      padding: 20px;

      border-radius: 16px;

      background: var(--card-background-color, white);
      color: var(--primary-text-color);

      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35);

      box-sizing: border-box;
    }

    .dialog-title {
      margin-bottom: 16px;

      font-size: 20px;
      font-weight: 500;

      text-align: center;
    }

    .dialog-options {
      display: grid;

      grid-template-columns: repeat(4, 1fr);

      gap: 10px;
    }

    /*
     * Dialogue Lite :
     * 2 boutons -> 2 colonnes au lieu de 4
     */

    .dialog-options.lite-options {
      grid-template-columns: repeat(2, 1fr);
    }

    .dialog-option {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      min-height: 80px;

      padding: 8px;

      border: none;
      border-radius: 12px;

      background: var(
        --secondary-background-color,
        rgba(128, 128, 128, 0.15)
      );

      color: inherit;

      cursor: pointer;

      font: inherit;
    }

    /*
     * Option sélectionnée :
     * fond beaucoup plus transparent pour
     * garder l'icône et le texte bien visibles.
     */

    .dialog-option.selected {
      background: color-mix(
        in srgb,
        var(--primary-color) 18%,
        transparent
      );

      color: var(--primary-color);
    }

    .dialog-option ha-icon {
      --mdc-icon-size: 30px;

      margin-bottom: 7px;
    }

    .dialog-option span {
      font-size: 12px;
      text-align: center;
    }

    .dialog-close {
      width: 100%;

      margin-top: 16px;
      padding: 10px;

      border: none;
      border-radius: 10px;

      background: var(--secondary-background-color);
      color: inherit;

      cursor: pointer;

      font: inherit;
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
   * ============================================================
   * TAP ACTION
   * ============================================================
   *
   * Si tap_action est configuré, il devient l'action principale
   * de la carte.
   */

  _hasTapAction() {

    return (
      this.config &&
      this.config.tap_action &&
      this.config.tap_action.action &&
      this.config.tap_action.action !== "none"
    );
  }

  async _handleTapAction() {

    if (!this.hass || !this._hasTapAction()) {
      return;
    }

    const action = this.config.tap_action;

    switch (action.action) {

      case "navigate":

        if (action.navigation_path) {

          history.pushState(
            null,
            "",
            action.navigation_path
          );

          window.dispatchEvent(
            new Event("location-changed")
          );
        }

        break;

      case "url":

        if (action.url_path) {

          window.open(
            action.url_path,
            "_blank"
          );
        }

        break;

      case "more-info":

        if (action.entity) {

          this._showMoreInfo(
            action.entity
          );
        }

        break;

      case "call-service":

        if (action.service) {

          const [domain, service] =
            action.service.split(".");

          if (domain && service) {

            await this.hass.callService(
              domain,
              service,
              action.service_data || {}
            );
          }
        }

        break;

      case "toggle":

        if (action.entity) {

          const entity =
            this.hass.states[action.entity];

          if (!entity) {
            return;
          }

          await this.hass.callService(
            "homeassistant",
            "toggle",
            {
              entity_id: action.entity,
            }
          );
        }

        break;

      default:
        break;
    }
  }

  /*
   * Intercepte les clics des commandes internes lorsque
   * tap_action est défini.
   */

  _handleInternalClick(event, callback) {

    if (this._hasTapAction()) {

      event.preventDefault();
      event.stopPropagation();

      this._handleTapAction();

      return;
    }

    callback();
  }

  /*
   * ============================================================
   * MORE INFO
   * ============================================================
   */

  _showMoreInfo(entityId) {

    if (!this.hass || !entityId) {
      return;
    }

    const event = new Event(
      "hass-more-info",
      {
        bubbles: true,
        composed: true,
      }
    );

    event.detail = {
      entityId: entityId,
    };

    this.dispatchEvent(event);
  }

  /*
   * ============================================================
   * OFFSET
   * ============================================================
   */

  async _changeOffset(direction) {

    if (!this.hass || !this.config) {
      return;
    }

    const zone = this.config.zone;

    const entityId =
      `number.airzone_zone_${zone}_offset_thermostat`;

    const entity =
      this.hass.states[entityId];

    if (!entity) {
      return;
    }

    const currentOffset =
      Number(entity.state);

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
   * LITE - DIALOGUE ON / OFF
   * ============================================================
   */

  _openLiteDialog(type) {

    this.liteDialog = type;
  }

  _closeLiteDialog() {

    this.liteDialog = null;
  }

  async _setLiteSwitch(entityId, state) {

    if (!this.hass || !entityId) {
      return;
    }

    await this.hass.callService(
      "switch",
      state === "on"
        ? "turn_on"
        : "turn_off",
      {
        entity_id: entityId,
      }
    );

    this._closeLiteDialog();
  }

  /*
   * ============================================================
   * BLUEFACE - DIALOGUES
   * ============================================================
   */

  _openBluefaceDialog(type) {

    this.bluefaceDialog = type;
  }

  _closeBluefaceDialog() {

    this.bluefaceDialog = null;
  }

  async _selectBluefaceOption(
    entityId,
    option
  ) {

    if (!this.hass) {
      return;
    }

    await this.hass.callService(
      "select",
      "select_option",
      {
        entity_id: entityId,
        option: option,
      }
    );

    this._closeBluefaceDialog();
  }

  /*
   * Options du mode machine
   */

  _getModeOptions() {

    return [
      {
        value: "Arrêt",
        label: "Arrêt",
        icon: "mdi:power",
      },
      {
        value: "Refroidissement",
        label: "Froid",
        icon: "mdi:snowflake",
      },
      {
        value: "Chauffage",
        label: "Chaud",
        icon: "mdi:fire",
      },
      {
        value: "Ventilation",
        label: "Vent",
        icon: "mdi:fan",
      },
    ];
  }

  /*
   * Options de vitesse
   */

  _getSpeedOptions() {

    return [
      {
        value: "Automatique",
        label: "Auto",
        icon: "mdi:fan-auto",
      },
      {
        value: "Faible",
        label: "Lent",
        icon: "mdi:fan-speed-1",
      },
      {
        value: "Moyenne",
        label: "Moyen",
        icon: "mdi:fan-speed-2",
      },
      {
        value: "Élevée",
        label: "Rapide",
        icon: "mdi:fan-speed-3",
      },
    ];
  }

  /*
   * ============================================================
   * CARTE LITE
   * ============================================================
   */

  _renderLite() {

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

    /*
     * État de la ZONE
     * -> détermine le clignotement
     * -> affiche ON / OFF
     */

    const zoneStateEntity =
      this.hass.states[
        `switch.airzone_zone_${zone}_etat`
      ];

    /*
     * Mode de la MACHINE
     * -> détermine uniquement la couleur
     */

    const machineModeEntity =
      this.hass.states[
        "select.airzone_mode"
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

    /*
     * État de la zone
     */

    const zoneIsOn =
      zoneStateEntity?.state === "on";

    const zoneIsOff =
      !zoneIsOn;

    const zoneState =
      zoneIsOn
        ? "ON"
        : "OFF";

    const zoneStateClass =
      zoneIsOn
        ? ""
        : "off";

    /*
     * Mode de la machine
     */

    const machineMode =
      machineModeEntity?.state;

    let ringState = "off";

    if (
      machineMode ===
      "Refroidissement"
    ) {

      ringState = "cooling";

    } else if (
      machineMode ===
      "Chauffage"
    ) {

      ringState = "heating";

    } else if (
      machineMode ===
      "Ventilation"
    ) {

      ringState = "cooling";

    } else {

      ringState = "off";
    }

    const ringClass = [
      "offset-center",
      ringState,
      zoneIsOff
        ? "zone-off"
        : "",
      "clickable",
    ]
      .filter(Boolean)
      .join(" ");

    /*
     * Entités utilisées par le dialogue Lite
     */

    const zoneEntityId =
      `switch.airzone_zone_${zone}_etat`;

    const ledEntityId =
      `switch.airzone_zone_${zone}_led_thermostat`;

    return html`

      <ha-card>

        <div class="thermostat">

          <img
            src="https://raw.githubusercontent.com/exelsis423/airzone-modbus-ha-card/main/images/airzone-lite.png"
          >

          <div class="zone-name">
            ${name}
          </div>

          <div class="info-line">

            <span
              class="clickable"
              @click=${event =>
                this._handleInternalClick(
                  event,
                  () =>
                    this._showMoreInfo(
                      `sensor.airzone_zone_${zone}_temperature_sonde`
                    )
                )}
            >
              ${temperature}
            </span>

            <span
              class="clickable"
              @click=${event =>
                this._handleInternalClick(
                  event,
                  () =>
                    this._showMoreInfo(
                      `sensor.airzone_zone_${zone}_humidite`
                    )
                )}
            >
              ${humidity}
            </span>

          </div>

          <div class="offset-line">

            <div
              class="offset-click-zone left clickable"
              @click=${event =>
                this._handleInternalClick(
                  event,
                  () =>
                    this._changeOffset(-1)
                )}
            ></div>

            <div
              class="offset-click-zone right clickable"
              @click=${event =>
                this._handleInternalClick(
                  event,
                  () =>
                    this._changeOffset(1)
                )}
            ></div>

            <!-- Anneau ON / OFF -->

            <div
              class="${ringClass}"
              @click=${event =>
                this._handleInternalClick(
                  event,
                  () =>
                    this._openLiteDialog(
                      "zone"
                    )
                )}
            ></div>

            <div class="offset-bars">

              ${offset <= -3
                ? html`
                    <span
                      class="offset-bar down large"
                    ></span>
                  `
                : ""}

              ${offset <= -2
                ? html`
                    <span
                      class="offset-bar down medium"
                    ></span>
                  `
                : ""}

              ${offset <= -1
                ? html`
                    <span
                      class="offset-bar down small"
                    ></span>
                  `
                : ""}

              ${offset >= 1
                ? html`
                    <span
                      class="offset-bar up small"
                    ></span>
                  `
                : ""}

              ${offset >= 2
                ? html`
                    <span
                      class="offset-bar up medium"
                    ></span>
                  `
                : ""}

              ${offset >= 3
                ? html`
                    <span
                      class="offset-bar up large"
                    ></span>
                  `
                : ""}

            </div>

          </div>

          <!-- État ON / OFF -->

          <div
            class="zone-state ${zoneStateClass} clickable"
            @click=${event =>
              this._handleInternalClick(
                event,
                () =>
                  this._openLiteDialog(
                    "zone"
                  )
              )}
          >
            ${zoneState}
          </div>

          <!-- LED -->

          ${ledEntity
            ? html`

                <div
                  class="led-status clickable"
                  @click=${event =>
                    this._handleInternalClick(
                      event,
                      () =>
                        this._openLiteDialog(
                          "led"
                        )
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

          <!-- =================================================
               DIALOGUE LITE
               ================================================= -->

          ${this.liteDialog
            ? html`

                <div
                  class="blueface-dialog-overlay"
                  @click=${this._closeLiteDialog}
                >

                  <div
                    class="blueface-dialog"
                    @click=${event =>
                      event.stopPropagation()}
                  >

                    ${this.liteDialog === "zone"
                      ? html`

                          <div class="dialog-title">
                            État de la zone
                          </div>

                          <div
                            class="dialog-options lite-options"
                          >

                            <button
                              class="dialog-option
                                ${zoneIsOn
                                  ? "selected"
                                  : ""}"
                              @click=${() =>
                                this._setLiteSwitch(
                                  zoneEntityId,
                                  "on"
                                )}
                            >

                              <ha-icon
                                icon="mdi:power"
                              ></ha-icon>

                              <span>
                                ON
                              </span>

                            </button>

                            <button
                              class="dialog-option
                                ${!zoneIsOn
                                  ? "selected"
                                  : ""}"
                              @click=${() =>
                                this._setLiteSwitch(
                                  zoneEntityId,
                                  "off"
                                )}
                            >

                              <ha-icon
                                icon="mdi:power-off"
                              ></ha-icon>

                              <span>
                                OFF
                              </span>

                            </button>

                          </div>

                        `
                      : html`

                          <div class="dialog-title">
                            LED thermostat
                          </div>

                          <div
                            class="dialog-options lite-options"
                          >

                            <button
                              class="dialog-option
                                ${ledOn
                                  ? "selected"
                                  : ""}"
                              @click=${() =>
                                this._setLiteSwitch(
                                  ledEntityId,
                                  "on"
                                )}
                            >

                              <ha-icon
                                icon="mdi:led-on"
                              ></ha-icon>

                              <span>
                                Activée
                              </span>

                            </button>

                            <button
                              class="dialog-option
                                ${!ledOn
                                  ? "selected"
                                  : ""}"
                              @click=${() =>
                                this._setLiteSwitch(
                                  ledEntityId,
                                  "off"
                                )}
                            >

                              <ha-icon
                                icon="mdi:led-off"
                              ></ha-icon>

                              <span>
                                Désactivée
                              </span>

                            </button>

                          </div>

                        `}

                    <button
                      class="dialog-close"
                      @click=${this._closeLiteDialog}
                    >
                      Annuler
                    </button>

                  </div>

                </div>

              `
            : ""}

          <!-- TAP ACTION GLOBAL -->

          ${this._hasTapAction() &&
          !this.liteDialog
            ? html`

                <div
                  class="card-tap-action"
                  @click=${() =>
                    this._handleTapAction()}
                ></div>

              `
            : ""}

        </div>

      </ha-card>
    `;
  }

  /*
   * ============================================================
   * CARTE BLUEFACE
   * ============================================================
   */

  _renderBlueface() {

    const zone = this.config.zone;

    /*
     * Température de la zone
     */

    const temperatureEntity =
      this.hass.states[
        `sensor.airzone_zone_${zone}_temperature_sonde`
      ];

    const temperature =
      temperatureEntity?.state !== undefined
        ? `${temperatureEntity.state} °C`
        : "";

    /*
     * Mode machine
     */

    const modeEntity =
      this.hass.states[
        "select.airzone_mode"
      ];

    /*
     * Vitesse machine
     */

    const speedEntity =
      this.hass.states[
        "select.airzone_vitesse_ventilation"
      ];

    const mode =
      modeEntity?.state ||
      "Arrêt";

    const speed =
      speedEntity?.state ||
      "Automatique";

    const modeOptions =
      this._getModeOptions();

    const speedOptions =
      this._getSpeedOptions();

    const currentMode =
      modeOptions.find(
        option =>
          option.value === mode
      );

    const currentSpeed =
      speedOptions.find(
        option =>
          option.value === speed
      );

    return html`

      <ha-card>

        <div class="blueface">

          <img
            src="https://raw.githubusercontent.com/exelsis423/airzone-modbus-ha-card/main/images/airzone-blueface.png"
          >

          <!-- Température -->

          ${temperature
            ? html`

                <div
                  class="blueface-temperature clickable"
                  @click=${event =>
                    this._handleInternalClick(
                      event,
                      () =>
                        this._showMoreInfo(
                          `sensor.airzone_zone_${zone}_temperature_sonde`
                        )
                    )}
                >
                  ${temperature}
                </div>

              `
            : ""}

          <!-- Commandes -->

          <div class="blueface-controls">

            <!-- MODE -->

            <div
              class="blueface-control"
              @click=${event =>
                this._handleInternalClick(
                  event,
                  () =>
                    this._openBluefaceDialog(
                      "mode"
                    )
                )}
            >

              <div class="blueface-label">
                ${currentMode?.label ||
                "Mode"}
              </div>

              <div class="blueface-icon">

                <ha-icon
                  icon="${currentMode?.icon ||
                    "mdi:air-conditioner"}"
                ></ha-icon>

              </div>

            </div>

            <!-- VITESSE -->

            <div
              class="blueface-control"
              @click=${event =>
                this._handleInternalClick(
                  event,
                  () =>
                    this._openBluefaceDialog(
                      "speed"
                    )
                )}
            >

              <div class="blueface-label">
                ${currentSpeed?.label ||
                "Auto"}
              </div>

              <div class="blueface-icon">

                <ha-icon
                  icon="${currentSpeed?.icon ||
                    "mdi:fan"}"
                ></ha-icon>

              </div>

            </div>

          </div>

          <!-- DIALOGUE BLUEFACE -->

          ${this.bluefaceDialog
            ? html`

                <div
                  class="blueface-dialog-overlay"
                  @click=${this._closeBluefaceDialog}
                >

                  <div
                    class="blueface-dialog"
                    @click=${event =>
                      event.stopPropagation()}
                  >

                    ${this.bluefaceDialog === "mode"
                      ? html`

                          <div class="dialog-title">
                            Mode
                          </div>

                          <div class="dialog-options">

                            ${modeOptions.map(
                              option =>
                                html`

                                  <button
                                    class="dialog-option
                                      ${option.value === mode
                                        ? "selected"
                                        : ""}"
                                    @click=${() =>
                                      this._selectBluefaceOption(
                                        "select.airzone_mode",
                                        option.value
                                      )}
                                  >

                                    <ha-icon
                                      icon="${option.icon}"
                                    ></ha-icon>

                                    <span>
                                      ${option.label}
                                    </span>

                                  </button>

                                `
                            )}

                          </div>

                        `
                      : html`

                          <div class="dialog-title">
                            Vitesse
                          </div>

                          <div class="dialog-options">

                            ${speedOptions.map(
                              option =>
                                html`

                                  <button
                                    class="dialog-option
                                      ${option.value === speed
                                        ? "selected"
                                        : ""}"
                                    @click=${() =>
                                      this._selectBluefaceOption(
                                        "select.airzone_vitesse_ventilation",
                                        option.value
                                      )}
                                  >

                                    <ha-icon
                                      icon="${option.icon}"
                                    ></ha-icon>

                                    <span>
                                      ${option.label}
                                    </span>

                                  </button>

                                `
                            )}

                          </div>

                        `}

                    <button
                      class="dialog-close"
                      @click=${this._closeBluefaceDialog}
                    >
                      Annuler
                    </button>

                  </div>

                </div>

              `
            : ""}

          <!-- TAP ACTION GLOBAL -->

          ${this._hasTapAction() &&
          !this.bluefaceDialog
            ? html`

                <div
                  class="card-tap-action"
                  @click=${() =>
                    this._handleTapAction()}
                ></div>

              `
            : ""}

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

    if (
      this.config.thermostat ===
      "blueface"
    ) {

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

