import React from 'react';
import Skeleton from 'react-loading-skeleton';

const loadingSkeletons = {
    postContent: (index) => (
        <React.Fragment key={`postContent-${index}`}>
            <div className="post-content">
                <h1><Skeleton width={'100%'} height={50} /></h1>
                <article><Skeleton width={'100%'} height={50} /></article>
            </div>
            <div key={`commentSection-${index}`}>
                <section className="comment-section">
                    <h1 className="comments-title">Comments</h1>
                    <div className="mt-4">
                        {/* Your comment section content */}
                    </div>
                </section>
            </div>
        </React.Fragment>
    ),
    commentStack: (index) => (
        <div className='comment-stack' key={`commentStack-${index}`}>
            <div className="comment">
                <div className="header">
                    <div className="name">
                        <Skeleton width={'20%'} />
                    </div>
                    <div className="date">
                        <Skeleton width={'40%'} />
                    </div>
                </div>
                <div className="message">
                    <Skeleton count={3} />
                </div>
                <div className="footer">
                    <Skeleton width={'20%'} height={20} />
                </div>
            </div>
        </div>
    ),
};

export function usePostLoading(loading, skeletonCounts) {
    if (loading) {
        const skeletons = [];
        let numberOfPostLoader = skeletonCounts[0];
        let numberOfCommentLoader = skeletonCounts[1];
        let i = 0;
        while (i < numberOfPostLoader) {
            skeletons.push(loadingSkeletons.postContent(i));
            i++;
        }
        numberOfCommentLoader += i;
        while (i < numberOfCommentLoader) {
            skeletons.push(loadingSkeletons.commentStack(i));
            i++;
        }
        return skeletons;
    }
    return null;
}
