import { TrackerUtility } from "../utils/combat-tracker.js";
import { FabulaUltimaInitiative } from "./fabula-ultima-initiative.js";

Hooks.on("init", () => {
    game.fui = game.fui ?? {};

    game.fui.fabulaUltimaInitiative = new FabulaUltimaInitiative();
    
    game.fui.trackerUility = new TrackerUtility();
});

Hooks.on("deleteCombat", (combat, options, userId) => {
    TrackerUtility._onDeleteCombat(combat, options, userId);
});

Hooks.on("deleteCombatant", (combatant, options, userId) => {
    TrackerUtility._onDeleteCombatant(combatant, options, userId);
});

Hooks.on("renderCombatTracker", (app, html, data) => {
    TrackerUtility._onRenderCombatTracker(app, html, data);
    FabulaUltimaInitiative._onRenderCombatTracker(app, html, data);
});