import { Section } from '../model/section.model';
import { IdType } from '../common/common-types';
import { DynamicComponent } from '../Components/DynamicComponents/dynamic-component.model';
import dynamicComponentService from './dynamic-component-service';

export const API_BASE = 'http://192.168.0.100:1337/api';

class farsideSection {

}

class SectionService {
    constructor(private apiUrl: string) {
    }

    async adaptIncoming(section: any) {
        section.id = section._id;
        delete section._id;
        if (!section.route) {
            section.route = section.name;
        }

        let built: { [s: string]: DynamicComponent } = {}
        for (const key in section.components) {
            built[key] = await dynamicComponentService.getDynamicComponentById(section.components[key]);
        }
        let res = { ...section, "components": built };
        // console.log(res)
        return res as Section;
    }

    adaptOutgoing = (section: any) => {
        section._id = section.id;
        delete section.id;
        if (!section.route) {
            section.route = section.name;
        }
        let stripped: { [s: string]: IdType } = {};
        for (const key in section.components) {
            stripped[key] = section.components[key].id;
        }
        section.components = stripped;
        return section;
    }

    async getAllSections() {
        console.log("Requested All sections");
        const resp = await fetch(`${API_BASE}/sections`);
        const receivedSections = await resp.json();
        let sections: Section[] = [];
        for (const recvSec in receivedSections) {
            // console.log(recvSec);
            sections = [...sections, await this.adaptIncoming(receivedSections[recvSec])];
        }
        return sections;
    }

    async getSectionById(sectionId: IdType) {
        // console.log(`Requesting section ${sectionId}`)
        const resp = await fetch(`${API_BASE}/sections/${sectionId}`);
        // console.log(`Receive resp ${resp}`)
        const section = await this.adaptIncoming(await resp.json());
        // console.log(section)
        return section;
    }

    async createNewSection(section: Section) {
        const resp = await fetch(`${API_BASE}/sections`, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(section),
        });
        const created = await resp.json();
        return created;
    }

    async updateSection(section: Section) {
        // console.log(section)
        const resp = await fetch(`${API_BASE}/sections/${section.id}`, {
            method: 'PUT',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.adaptOutgoing(section)),
        });
        const updated = await resp.json();
        return updated;
    }

    async deleteSection(sectionId: IdType) {
        const resp = await fetch(`${API_BASE}/sections/${sectionId}`, {
            method: 'DELETE',
            mode: 'cors'
        });
        const deleted = await resp.json();
        return deleted;
    }
}

export default new SectionService(API_BASE);

