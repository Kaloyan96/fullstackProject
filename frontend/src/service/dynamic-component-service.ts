import { DynamicComponent } from '../Components/DynamicComponents/dynamic-component.model';
import { IdType } from '../common/common-types';

export const API_BASE = 'http://192.168.0.100:1337/api';
export const API_URI = "components";

class DynamicComponentService {
    constructor(
        public availableComponents: { [s: string]: DynamicComponent }
    ) { }

    adaptIncoming = (dynamicComponent: any) => {
        dynamicComponent.id = dynamicComponent._id;
        delete dynamicComponent._id;
        return dynamicComponent as DynamicComponent;
    }

    adaptOutgoing = (dynamicComponent: any) => {
        dynamicComponent._id = dynamicComponent.id;
        delete dynamicComponent.id;
        return dynamicComponent;
    }

    async getAllDynamicComponents() {
        // console.log("Requested All dynamicComponents");
        const resp = await fetch(`${API_BASE}/${API_URI}`);
        const dynamicComponents = await resp.json();
        dynamicComponents.forEach(this.adaptIncoming);
        return dynamicComponents;
    }

    async getDynamicComponentById(dynamicComponentId: IdType) {
        const resp = await fetch(`${API_BASE}/${API_URI}/${dynamicComponentId}`);
        const dynamicComponent = this.adaptIncoming(await resp.json());

        return dynamicComponent;
    }

    async createNewDynamicComponent(dynamicComponent: DynamicComponent) {
        const resp = await fetch(`${API_BASE}/${API_URI}`, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.adaptOutgoing(dynamicComponent)),
        });
        const created = await resp.json();
        return created;
    }

    async updateDynamicComponent(dynamicComponent: DynamicComponent) {
        // console.log(dynamicComponent)
        const resp = await fetch(`${API_BASE}/${API_URI}/${dynamicComponent.id}`, {
            method: 'PUT',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.adaptOutgoing(dynamicComponent)),
        });
        const updated = await resp.json();
        return updated;
    }

    async deleteDynamicComponent(dynamicComponentId: IdType) {
        const resp = await fetch(`${API_BASE}/${API_URI}/${dynamicComponentId}`, {
            method: 'DELETE',
            mode: 'cors'
        });
        const deleted = await resp.json();
        return deleted;
    }
}

export default new DynamicComponentService({
    //  "TopNav": TopNav
});

