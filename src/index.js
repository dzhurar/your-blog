import Handlebars from 'handlebars';
// get posts
async function getPosts() {
    try {
        const res = await fetch('http://localhost:3000/posts');
        const posts = await res.json()
        renderPosts(posts)
        return posts;
    } catch (error) {
        console.error(error)
    }
}
// render posts
function renderPosts(posts){
    const source = document.getElementById('postTemplate').innerHTML;
    const compile = Handlebars.compile(source);

    posts.forEach(post => {
        const html = compile(post);
        // document.getElementById('postsList').insertAdjacentHTML('afterbegin', html)
        document.getElementById('postsList').innerHTML = html;
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
    e.preventDefault;
    if(document.getElementById('addTitle').value && document.getElementById('addArticle').value){
        addPost()
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
window.deletePost = deletePost;