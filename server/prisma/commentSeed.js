import { Prisma, PrismaClient } from "@prisma/client";
async function addCommentToPost(postId, parentId, userId, message) {
    const prisma = new PrismaClient();
    console.log("this is the postid ", postId)
    console.log("this is the parentId ", parentId)
    console.log("this is the userid", userId)
    console.log("this is the message ", message)
    try {
        const newComment = await prisma.comment.create({
            data: {
                message: message,
                postId: postId,
                userId: userId,
                parentId: parentId
            },
        });

        console.log('Comment added:', newComment);
    } catch (error) {
        console.error('Error adding comment:', error);
    } finally {
        await prisma.$disconnect();
    }
}

export default addCommentToPost