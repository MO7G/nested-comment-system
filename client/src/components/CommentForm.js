import { useState } from "react"

export function CommentForm({ loading, error, onSubmit, autoFocusStatus = false, intialValue = "" }) {
    const [message, setMessage] = useState(intialValue)


    //Todo: sanitize the comments from potential sql injections or xss scripts  and check for maximum comment length
    const setMessageHelper = (e) => {
        const message = e.target.value
        setMessage(message)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(message)
            .then(() => setMessage(''))
            .catch((error) => {
                console.error("this is error is from the onSubmit in the commentForm ya hajji")
            })}




    return (
        <form onSubmit={handleSubmit}>
            <div className="comment-form-row">
                <textarea autoFocus={autoFocusStatus} className="message-input" value={message} onChange={e => setMessageHelper(e)} />
                <button className="btn" type="submit" disabled={loading}>{loading ? "Loading" : "Post"}</button>
            </div>
            <div className="error-msg">{error}</div>
        </form>
    )
}