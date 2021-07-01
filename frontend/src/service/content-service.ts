import { Content } from '../model/content.model';
import { IdType } from '../common/common-types';

export const API_BASE = 'http://192.168.0.100:1337/api';

class ContentService {
    constructor(private apiUrl: string) {
    }

    adaptIncoming = (content: any) => {
        content.id = content._id;
        delete content._id;
        return content as Content;
    }

    adaptOutgoing = (content: any) => {
        content._id = content.id;
        delete content.id;
        return content;
    }

    async getAllContent() {
        console.log("Requested All content");
        const resp = await fetch(`${API_BASE}/content`);
        const content = await resp.json();
        content.forEach(this.adaptIncoming);
        return content;
    }

    async getContentById(contentId: IdType) {
        const resp = await fetch(`${API_BASE}/content/${contentId}`);
        const content = this.adaptIncoming(await resp.json());
        return content;
    }

    async createNewContent(content: Content) {
        const resp = await fetch(`${API_BASE}/content`, {
            method: 'POST',
            mode: 'cors',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(this.adaptOutgoing(content)),
        });
        const created = await resp.json();
        return created;
    }

    async updateContent(content: Content) {
        const resp = await fetch(`${API_BASE}/content/${content.id}`, {
            method: 'PUT',
            mode: 'cors',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(this.adaptOutgoing(content)),
        });
        const updated = await resp.json();
        return updated;
    }

    async deleteContent(contentId: IdType) {
        const resp = await fetch(`${API_BASE}/content/${contentId}`, {
            method: 'DELETE',
            mode: 'cors'
        });
        const deleted = await resp.json();
        return deleted;
    }
}

export default new ContentService(API_BASE);

