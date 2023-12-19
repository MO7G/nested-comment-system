import React from 'react';
import Skeleton from 'react-loading-skeleton';

const loadingSkeletons = {
    postList: (index) => (
        <div className="post-list-container" key={index}>
            <div className="post-list-item">
                <h1>
                    <Skeleton width={'100%'} height={50} />
                </h1>
            </div>
        </div>
    )
};

export function usePostListLoading(loading, numberOfSkeletons) {
    if (loading) {
        const skeletons = Array.from({ length: numberOfSkeletons }, (_, index) =>
            loadingSkeletons.postList(index)
        );
        return skeletons;
    }
    return null;
}
