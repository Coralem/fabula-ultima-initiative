import { FabulaUltimaInitiativeForm } from "../forms/form.js";

export class FabulaUltimaInitiative {
    
    /**
     * Handler for combat tracker render
     * @param {*} app 
     * @param {*} html 
     * @param {*} data 
     */
    static async _onRenderCombatTracker(app, html, data) {
        if (!game.user.isGM) {
            return;
        }

        const combatantList = html.find("#combat-tracker.directory-list");
        const listItemHtml = `<div class="flexrow"><a class="configure-initiative"><i class="fa fa-plus"></i> ${game.i18n.localize(`fabula-ultima-initiative.ConfigureInitiative`)}</a></div>`;

        if (!game.combat || !combatantList.length) {
            return;
        }

        combatantList.append(listItemHtml);

        const button = combatantList.find(".configure-initiative")

        button.on("click", event => {
            //TemporaryCombatants._onAddTemporaryCombatant(event);
            FabulaUltimaInitiative._onConfigureInitiative(event);
        });
    }

    /**
     * Open the Fabula Ultima Initiative form
     * @param {*} event
     */
    static _onConfigureInitiative(event) {
        const fabulaUltimaInitiativeForm = new FabulaUltimaInitiativeForm({}).render(true);
    }

    /**
     * Remove PC and NPC turns from the tracker
     * @param {*} combatants
     * @param {*} scene
     */
    static async _removeFabulaUltimaTurns(combatants) {
        const tempCombatants = combatants.filter(c => c.getFlag('fabula-ultima-initiative', 'fabula-ultima-combatant'));
        
        const tokens = combatants.filter(c => c.token).map(c => c.token) ?? [];
        const sceneIds = new Set(tokens.map(t => t.parent.id));
        const actorIds = tempCombatants.filter(c => c.actor).map(c => c.actor.Id);
        
        for (const sceneId of sceneIds) {
            const scene = game.scenes.get(sceneId);
            if (!scene) continue;
            const tokenIds = tokens.filter(t => t.sceneId == scene.Id).map(t => t.id);
            scene.deleteEmbeddedDocuments("Token", tokenIds);
        }
        
        
        if (actorIds) {
            Actor.deleteDocuments(actorIds);
        }
        
    }

    /**
     * Removes a single temporary combatant created by this module
     * @param {*} combatant 
     */
    static async _removeFabulaUltimaTurn(combatant) {
        if (!combatant.getFlag('fabula-ultima-initiative', 'fabula-ultima-combatant')) return;

        const actor = combatant.actor;
        const token = combatant.token;

        if (actor && game.actors.get(actor.id)) {
            await actor.delete();
        }

        if (token && token.parent) {
            await token.parent.deleteEmbeddedDocuments("Token", [token.id]);
        }        
    }
}