"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const entities_1 = __importDefault(require("../../templates/config/entities"));
exports.default = {
    genrerateStruct: (name, attributes) => {
        let entity = '';
        let struct = entities_1.default.storage.struct.replace('$name', name);
        let attributeContent = '';
        entity = entities_1.default.storage.derive + '\n' + entities_1.default.storage.serde + '\n';
        attributes.map(attribute => {
            attributeContent += '\n' + entities_1.default.storage.initContent(attribute.name, attribute.type) + '\n';
        });
        struct = struct.replace('$content', attributeContent);
        entity += struct;
        return entity;
    },
    genrerateEnum: (name, attributes) => {
        let entity = '';
        let struct = entities_1.default.enum.struct.replace('$name', name);
        let attributeContent = '';
        entity = entities_1.default.enum.derive + '\n';
        attributes.map(attribute => {
            attributeContent += '\n' + entities_1.default.enum.initContent(attribute.name, attribute.type) + '\n';
        });
        struct = struct.replace('$content', attributeContent);
        entity += struct;
        return entity;
    },
    genrerateContract: (name, attributes) => {
        let entity = '';
        let contract = entities_1.default.contract.struct.replace('$name', name);
        let attributeContent = '';
        entity = entities_1.default.contract.header + '\n' + entities_1.default.contract.derive + '\n';
        attributes.map(attribute => {
            attributeContent += '\n' + entities_1.default.contract.initContent(attribute.name, attribute.type) + '\n';
        });
        contract = contract.replace('$content', attributeContent);
        entity += contract;
        return entity;
    }
};
//# sourceMappingURL=generateRust.js.map