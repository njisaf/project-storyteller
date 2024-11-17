export default class StorytellerActorSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["project-storyteller", "sheet", "actor"],
            template: "systems/project-storyteller/templates/actor/actor-sheet.hbs",
            width: 600,
            height: 600,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "aspects" }]
        });
    }

    getData() {
        const data = super.getData();
        data.dtypes = ["String", "Number", "Boolean"];

        // Calculate aspect modifiers
        for (let [key, aspect] of Object.entries(data.data.aspects)) {
            aspect.modifier = Math.floor((aspect.value - 10) / 2);
        }

        // Calculate skill totals
        for (let [categoryKey, category] of Object.entries(data.data.skills)) {
            for (let [skillKey, skill] of Object.entries(category)) {
                const aspect = data.data.aspects[skill.aspect];
                skill.total = skill.value + skill.aptitude + (aspect ? aspect.modifier : 0);
            }
        }

        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);

        // Add Inventory Item
        html.find('.item-create').click(this._onItemCreate.bind(this));

        // Update Inventory Item
        html.find('.item-edit').click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("itemId"));
            item.sheet.render(true);
        });

        // Delete Inventory Item
        html.find('.item-delete').click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("itemId"));
            item.delete();
            li.slideUp(200, () => this.render(false));
        });

        // Skill Rolls
        html.find('.skill-roll').click(this._onSkillRoll.bind(this));

        if (this.isEditable) {
            new ContextMenu(html, ".item-list .item", [], {
                onOpen: () => ui.context.activate(),
                onClose: () => ui.context.deactivate()
            });
        }
    }

    async _onSkillRoll(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const dataset = element.dataset;
        const skillKey = dataset.skill;
        const categoryKey = dataset.category;

        const skill = this.actor.data.data.skills[categoryKey][skillKey];
        const aspectMod = this.actor.data.data.aspects[skill.aspect].modifier;
        const total = skill.value + skill.aptitude + aspectMod;

        // Roll 2d10
        const roll = await new Roll("2d10").evaluate({async: true});
        const d20Roll = roll.total;

        // Determine success/failure
        const criticalSuccess = d20Roll >= 18;
        const criticalFailure = d20Roll <= 3;
        const success = d20Roll + total >= 10;

        // Create chat message
        let resultClass = success ? "success" : "failure";
        if (criticalSuccess) resultClass = "critical-success";
        if (criticalFailure) resultClass = "critical-failure";

        const rollData = {
            actor: this.actor,
            roll: roll,
            skillName: skillKey,
            total: d20Roll + total,
            resultClass: resultClass,
            isSuccess: success,
            isCriticalSuccess: criticalSuccess,
            isCriticalFailure: criticalFailure,
            aspects: this.actor.data.data.aspects
        };

        const chatTemplate = "systems/project-storyteller/templates/chat/skill-roll.hbs";
        const html = await renderTemplate(chatTemplate, rollData);

        const chatData = {
            user: game.user.id,
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            content: html,
            sound: CONFIG.sounds.dice,
            type: CONST.CHAT_MESSAGE_TYPES.ROLL,
            roll: roll
        };

        return ChatMessage.create(chatData);
    }

    _onItemCreate(event) {
        event.preventDefault();
        const header = event.currentTarget;
        const type = header.dataset.type;
        const itemData = {
            name: `New ${type.capitalize()}`,
            type: type,
            data: duplicate(header.dataset)
        };
        delete itemData.data["type"];
        return this.actor.createEmbeddedDocuments("Item", [itemData]);
    }
}
