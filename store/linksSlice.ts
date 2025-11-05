import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type LinkItem = {
	_id?: string;
	userId: string;
	originalUrl: string;
	slug: string;
	title?: string;
	createdAt: string | Date;
	updatedAt: string | Date;
	clickCount: number;
};

type LinksState = {
	items: LinkItem[];
	loading: boolean;
	error?: string;
};

const initialState: LinksState = {
	items: [],
	loading: false,
};

const linksSlice = createSlice({
	name: "links",
	initialState,
	reducers: {
		setLinks(state, action: PayloadAction<LinkItem[]>) {
			state.items = action.payload;
		},
		setLoading(state, action: PayloadAction<boolean>) {
			state.loading = action.payload;
		},
		setError(state, action: PayloadAction<string | undefined>) {
			state.error = action.payload;
		},
	},
});

export const { setLinks, setLoading, setError } = linksSlice.actions;
export const linksReducer = linksSlice.reducer;
