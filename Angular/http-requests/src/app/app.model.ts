export interface IPostData {
	title: string;
	content: string;
}

export interface IPostDataAPIResponse extends IPostData {
	id: string;
}

export interface IFireBaseResponse {
	[k: string]: IPostData;
}
