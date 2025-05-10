import Handlebars from 'handlebars';
import { nanoid } from 'nanoid';
// get posts
async function getPosts() {
    try {
        const res = await fetch('http://localhost:3000/posts');
        const posts = await res.json()
        renderPosts(posts)
        console.log(posts)
        return posts;
    } catch (error) {
        console.error(error)
    }
}



// render posts
function renderPosts(posts){
    const source = document.getElementById('postTemplate').innerHTML;
    const compile = Handlebars.compile(source);

    document.getElementById('postsList').innerHTML = '';
    posts.forEach(post => {
        const html = compile(post);
        document.getElementById('postsList').insertAdjacentHTML('afterbegin', html)
    });
}
const loadbtn = document.getElementById('loadBtn');

loadbtn.addEventListener('click', () =>{
    getPosts()
})



// add post
document.querySelector('.createPostForm').addEventListener('submit', (e)=>{e.preventDefault()}) // remove page reload

async function addPost(){
    const title = document.getElementById('addTitle').value;
    const article = document.getElementById('addArticle').value;
    const newPost = {
        title: title,
        article: article,
        date: new Date().toLocaleDateString(),
        comments: []
    }
    await fetch('http://localhost:3000/posts',{
        method: 'POST',
        body:JSON.stringify(newPost)
    })
    document.getElementById('addTitle').value = '';

    document.getElementById('addArticle').value = '';
    getPosts()
}

document.getElementById('addPost').addEventListener('click', (e) =>{
    if(document.getElementById('addTitle').value && document.getElementById('addArticle').value){
        if(document.getElementById('addPost').textContent === 'Post'){
            addPost()
        } else if(document.getElementById('addPost').textContent === 'Redact'){
            sendRedactedPost();
            editingPostId = 0;
        }
        return;
    }else{
        console.log('empty');
        return;
    }
})



// delete post
async function deletePost(id){
    await fetch(`http://localhost:3000/posts/${id}`, {
        method: 'DELETE'
    });
    getPosts()
    console.log(id)
}

const list = document.getElementById('postsList');

list.addEventListener('click', event => {
    if(event.target.closest('.clickbtn-del')){
        const btnDel = event.target.closest('.clickbtn-del');
        if (!btnDel) return;
        const id = btnDel.dataset.id;
        deletePost(id)
    } else if(event.target.closest('.open-comments')){
        const btnOpenComments = event.target.closest('.open-comments');
        const postId = btnOpenComments.dataset.openCommentsId;
        revealComments(postId)
    } else if(event.target.closest('.close-comments')){
        const btnCloseComments = event.target.closest('.close-comments');
        const closeId = btnCloseComments.dataset.closeCommentsId;
        hideComments(closeId);
    } else if(event.target.closest('.postComment')){
        const sendCommentFor = event.target.closest('.postComment').dataset.sendnewcomment;
        const input = document.querySelector(`input[data-postCommentId="${sendCommentFor}"]`) 

        const newComment = {
            id: nanoid(8),
            text: `${input.value.trim()}`
        }

        try {
        fetch(`http://localhost:3000/posts/${id}`)
        .then(res => res.json())
        .then(post => {
            const comments = post.comments;
            
            comments.push(newComment)
            sendnewComments(sendCommentFor, comments);
        })
    } catch (error) {
        
    }

        input.value = '';
    }
});



// redact post
let editingPostId;
list.addEventListener('click', event => {
    const btn = event.target.closest('.clickbtn-red');
    if (!btn) return;
    const id = btn.dataset.id;
    document.getElementById('addPost').textContent = 'Redact';
    redactPost(id)
    postComment('3cf3');
  });

async function redactPost(id){
    try {
        editingPostId = id;
        const res = await fetch(`http://localhost:3000/posts/${id}`);
        const post = await res.json()
        document.getElementById('addTitle').value = post.title;

        document.getElementById('addArticle').value = post.article;
        console.log(post)
    } catch (error) {
        console.log(error)
    }
}
async function sendRedactedPost(){
    document.getElementById('addPost').textContent = 'Post';
    const editedPost = {
        title: document.getElementById('addTitle').value,
        article: document.getElementById('addArticle').value,
    }
    await   fetch(`http://localhost:3000/posts/${editingPostId}`,{
        method: 'PATCH',
        body: JSON.stringify(editedPost),
    })
    document.getElementById('addTitle').value = '';
    document.getElementById('addArticle').value = '';
    getPosts()
}

// work with comments
// open comments (index.js - 92)
function revealComments(id){
    console.log(id)
    const comments = document.querySelector(`[data-show-id="${id}"]`)
    comments.classList.add('visible')
}
function hideComments(id){
    console.log(id)
    const comments = document.querySelector(`[data-show-id="${id}"]`)
    comments.classList.remove('visible');
}
// post comment (index.js - 100)
// async function postComment(id, comment){
//     try {
//         await fetch(`http://localhost:3000/posts/${id}`)
//         .then(res => res.json())
//         .then(post => {
//             const comments = post.comments;
            
//             comments.push(comment)
//             console.log(comments)
//         })
//     } catch (error) {
        
//     }
// }
// postComment("3cf3", {
//           "id": 4,
//           "text": "Ilie in the green grass"
//         })
// async function sendComment(comments){
//     try {
//         await fetch()
//     } catch (error) {
        
//     }
// }
async function sendnewComments(id, comments){
    try {
        await fetch(`http://localhost:3000/posts/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ comments: comments })
        });
        getPosts()
    } catch (error) {
        console.error(error)
    }
}