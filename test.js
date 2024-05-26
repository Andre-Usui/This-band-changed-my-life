
 
const posts = [];

function Post(number, title, text, edit, del) {
    this.number = NaN;
    this.title = '';
    this.text = '';
    this.edit = false;
    this.del = false;
}

function generatePostObject() {
  for (var i = 0; i <= posts.length; i++) { // create 3 post objects
    if (!posts[i]) {
      posts[i] = new Post();
      posts[i].number = i;
      posts[i].title = (i) + ' title';
      posts[i].text = (i) + ' text';
      console.log(posts[i]);
      console.log(posts);
      i++;
    }
  }
}

generatePostObject();
console.log('1');
generatePostObject();
console.log('2');
