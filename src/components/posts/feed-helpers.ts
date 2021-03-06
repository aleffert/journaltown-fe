import { reduce, orderBy } from 'lodash';
import { Post } from "../../services/api/models";
import { Optional, AsyncResult } from "../../utils";
import { PostsResponse, ApiAsync, CurrentUserResponse } from '../../services/api/requests';
import { AppError } from '../../utils/errors';

export function shouldShowLoadMore(nextPostResult: AsyncResult<PostsResponse, AppError>) {
    if(nextPostResult && nextPostResult.type === 'success') {
        return nextPostResult.value.length > 0;
    }
    return true;
}

export function newestModifiedDate(posts: Post[]): Optional<string> {
    return reduce(posts, (acc: Optional<string>, post: Post) => {
        if(!acc) {
            return post.last_modified;
        }
        else {
            return [post.last_modified, acc].sort()[0];
        }
    }, undefined);
}


export function oldestCreatedDate(posts: Post[]): Optional<string> {
    return reduce(posts, (acc: Optional<string>, post: Post) => {
        if(!acc) {
            return post.created_at;
        }
        else {
            return [post.created_at, acc].sort()[1];
        }
    }, undefined);
}

export function sortPosts(posts: {[id: number]: Post}) {
    return orderBy(Object.values(posts), 'created_at', 'desc');
}

export function canEditPost(post: Post, currentUser: ApiAsync<CurrentUserResponse>) {
    if(currentUser && currentUser.type === "success") {
        return currentUser.value.id === post.author.id;
    }
    return false;
}