import { LitElement, html, css } from "lit";

class DrivhusPlantCard extends LitElement {

  static get properties() {
    return {
      hass: {},
      config: {}
    };
  }

  static get styles() {
    return css`
      ha-card {
        padding: 16px;
        border-radius: 12px;
      }
      .title {
        font-size: 22px;
        font-weight: bold;
        margin-bottom: 12px;
      }
      .row {
        display: flex;
        justify-content: space-between;
        margin: 6px 0;
        font-size: 16px;
      }
      .status {
        margin-top: 14px;
        padding: 10px;
        border-radius: 8px;
        font-weight: bold;
        text-align: center;
        color: white;
      }
    `;
  }

  setConfig(config) {
    if (!config.moisture || !config.temperature || !config.conductivity) {
      throw new Error("Du skal angive moisture, temperature og conductivity sensorer.");
    }
    this.config = config;
  }

  render() {
    if (!this.hass) return html``;

    const m = Number(this.hass.states[this.config.moisture]?.state);
    const t = Number(this.hass.states[this.config.temperature]?.state);
    const c = Number(this.hass.states[this.config.conductivity]?.state);

    let status = "Planten har det godt";
    let color = "var(--info-color)";

    if (m < 30) { status = "Planten mangler vand"; color = "var(--error-color)"; }
    else if (m > 80) { status = "Jorden er for våd"; color = "var(--warning-color)"; }

    if (t < 10) { status = "Planten er for kold"; color = "var(--error-color)"; }
    else if (t > 35) { status = "Planten er for varm"; color = "var(--warning-color)"; }

    if (c < 1500) { status = "Jorden mangler næring"; color = "var(--warning-color)"; }
    else if (c > 5000) { status = "For meget gødning"; color = "var(--error-color)"; }

    return html`
      <ha-card>
        <div class="title">${this.config.name || "Drivhus Plante"}</div>

        <div class="row">
          <span>Jordfugt</span>
          <span>${m} %</span>
        </div>

        <div class="row">
          <span>Jordtemperatur</span>
          <span>${t} °C</span>
        </div>

        <div class="row">
          <span>EC (Næring)</span>
          <span>${c} µS/cm</span>
        </div>

        <div class="status" style="background:${color};">
          ${status}
        </div>
      </ha-card>
    `;
  }

  getCardSize() {
    return 3;
  }
}

customElements.define("drivhus-plant-card", DrivhusPlantCard);
