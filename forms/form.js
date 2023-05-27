/**
 * 
 */
export class FabulaUltimaInitiativeForm extends FormApplication {
    constructor(object, options) {
        super(object, options);
    }

    static get defaultOptions() {        
        return mergeObject(super.defaultOptions, {
            id: "fabula-ultima-initiative-form",
            title: game.i18n.localize(`fabula-ultima-initiative.Form.Title`),
            template: "modules/fabula-ultima-initiative/templates/fabula-ultima-initiative-form.html",
            classes: ["sheet"],
            width: 500,
            height: "auto",
            resizable: true,
            submitOnClose: false
        });
    }

    async _updateObject(event, formData) {
        const flags = {
            'fabula-ultima-initiative': {
                "fabula-ultima-combatant": true
            }
        }

        //Generate PC turns
        let totalTurns = parseInt(formData.pc_turns) + parseInt(formData.npc_turns)
        let pcTurns = formData.pc_turns
        let npcTurns = formData.npc_turns
        let currentTurn = 0
        if (formData.pc_winner) {
            currentTurn = 1;
        }
        const combatantArray = [];

        for (let i=totalTurns-1; i >= 0; i--) {
            if (currentTurn == 1 && pcTurns > 0) {
                combatantArray[i] = {
                    name: 'PC Turn',
                    img: formData.pc_icon,
                    hidden: false,
                    initiative: i,
                    flags
                }
                pcTurns--
                npcTurns > 0 ? currentTurn = 0 : currentTurn = 1
            }
            else if (npcTurns > 0) {
                combatantArray[i] = {
                    name: 'NPC Turn',
                    img: formData.npc_icon,
                    hidden: false,
                    initiative: i,
                    flags
                }
                npcTurns--
                pcTurns > 0 ? currentTurn = 1 : currentTurn = 0
            }
            else {
                currentTurn = 1
            }
        }
        
        const combatant = await game.combat.createEmbeddedDocuments("Combatant", combatantArray);
        
    }

    /**
     * Activate listeners for the form
     * @param {*} html 
     */
    activateListeners(html) {
        const cancelButton = html.find("button[name='cancel'");

        cancelButton.on("click", event => {
            this.close();
        });

        super.activateListeners(html);
    }
}