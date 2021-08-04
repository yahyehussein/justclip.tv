export interface Pagination<Data> {
    data: Data[];
    next_page_url?: string | null;
    from?: number;
    to: number;
    total?: number;
    unread?: number;
    links?: {
        active: boolean;
        label: string;
        url: string | null;
    }[];
}
