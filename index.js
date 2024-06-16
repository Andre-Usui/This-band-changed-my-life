import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const APIKeyLastFM = "ef77440ab93f633656239025d6bf900c";  //TODO: add .env 
const APILastFM = "https://ws.audioscrobbler.com/2.0";

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

/* 
############################################################

Aprimoramentos para o blog: 
    1 - Alterar funcionamento para que o usuário possa escolher mais de uma banda;
    2 - Integrar DB via Postegres;
    3 - Integrar Login; 
    4 - Integrar novos estilos customizáveis para o site;
    5 - Integrar API do youtube funcional e leve;
    6 - Integrar Secrets / Alterar o APIKEY;
    7 - Alterar feed.ejs de for para forEach.

############################################################

    2a fase: fazer um construtor de blog;
    3a fase: Iloveyoulist. Faça uma carta elogiando boas características e dando 
    oportunidade para a pessoa continuar a escrever características.

############################################################
*/

var blogTitle = {n: ''};   // TODO: colocar todas estas variáveis em um único objeto.
var editPost;
var posts = [];
//var errorName = false; //TODO: Sinalizar ao usuário que ele errou o nome do album. 

function Post(number=NaN, title='', album='', cover='', text='', edit=false) { //default parameters
    this.number = number;
    this.title = title;
    this.album = album;
    this.cover = cover;
    this.text = text;
    this.edit = edit;
};

app.get('/', (req, res) => {
    let templateName = 'start.ejs';
    if(blogTitle.n !== ''){templateName = 'index.ejs';};
    res.render(templateName, ({blogTitle, posts}));
    
});

app.get('/aboutus', (req, res) => {
    res.render('aboutUs.ejs', ({blogTitle, posts}));
});

app.post('/submitTitle', (req, res) =>{
    blogTitle.n = req.body["blogTitleStart"];
    res.render('index.ejs', ({blogTitle, posts}));
});

app.post('/submitPost', async (req, res) =>{  
    console.log(`the submitPost has been called`);
    try{
        const result = await axios.get(APILastFM, {
            params: {
                method: "album.getinfo",
                api_key: APIKeyLastFM,
                artist: blogTitle.n,
                album: req.body["postAlbum"],
                format: 'json'
            }});
        var albumCover = result.data.album.image[3]["#text"];
        console.log(`this is the link of cover: ${albumCover}`);
        console.log(`the submitPost has ended`);
       
    } catch (error) {
        await console.log(`an error occurs: ${error.message}`);
        albumCover = "/imgs/question-mark.jpg";         
    }
    posts.push(new Post(
        (posts.length+1), 
        req.body["postTitle"], 
        req.body["postAlbum"], 
        albumCover, 
        req.body["postText"]
    ));  
    res.render('index.ejs', ({blogTitle, posts}));
    }); 

app.post('/submitEdit', (req, res) =>{        
    editPost = posts[(req.body.postNum - 1)];  
    editPost.edit = true;
    res.render('index.ejs', ({blogTitle, posts, editPost})); 
});

app.post('/submitEditComplete', async (req, res) =>{     
    editPost.title = req.body.postTitle;
    editPost.text = req.body.postText;   
    editPost.album = req.body.postAlbum;
    editPost.edit = false;
    try{
        const result = await axios.get(APILastFM, {
            params: {
                method: "album.getinfo",
                api_key: APIKeyLastFM,
                artist: blogTitle.n,
                album: editPost.album,
                format: 'json'
            }});
        
        editPost.cover = result.data.album.image[3]["#text"];
        console.log(editPost.cover);
        console.log(`the editPost has ended`);
        res.redirect('/'); 
    } catch (error) {
        await console.log(`an error occurs in editPost: ${error.message}`);
        editPost.cover = "/imgs/question-mark.jpg";
        res.render('index.ejs', ({blogTitle, posts, editPost}));
    };
});

app.post('/submitDelete', (req, res) =>{ 
    var numDelete = (req.body.postNum - 1)
    for(var i = 0; i < posts.length ; i++){
        if (posts[i].number > posts[numDelete].number){
            posts[i].number = i;
    }};
    posts.splice(numDelete, 1);
    res.render('index.ejs', ({blogTitle, posts}));
});



app.post('/login', (req, res) => { //TODO: Aprimorar login; Colocar em separado.
    blogTitle.n = "Led Zeppelin"; 
        posts[0] = new Post();
        posts[0].number = 1;
        posts[0].title = 'Dazed and Confuse';
        posts[0].album = 'Led Zeppelin';
        posts[0].cover = 'https://lastfm.freetls.fastly.net/i/u/300x300/82b68b8267234a289714c0e20c4e288d.png';
        posts[0].text = 'This song was my number 1 on my tests on this site. Also it is the favorite Led`s music of a friend.';
        
        posts[1] = new Post();
        posts[1].number = 2;
        posts[1].title = 'Babe, Im gonna leave you';
        posts[1].album = 'Led Zeppelin';
        posts[1].cover = 'https://lastfm.freetls.fastly.net/i/u/300x300/82b68b8267234a289714c0e20c4e288d.png';
        posts[1].text = 'The most beatiful guitar fingering on the entire rockn roll story. I never loose a chance to play this song when i have a guitar on my couch.';
        
        posts[2] = new Post();
        posts[2].number = 3;
        posts[2].title = 'Good Times, Bad Times';
        posts[2].album = 'Led Zeppelin';
        posts[2].cover = 'https://lastfm.freetls.fastly.net/i/u/300x300/82b68b8267234a289714c0e20c4e288d.png';
        posts[2].text = 'The first song of Led in life if you are an album listener fan.';

        posts[3] = new Post();
        posts[3].number = 4;
        posts[3].title = 'Whole lotta love';
        posts[3].album = 'Led Zeppelin II';
        posts[3].cover = 'https://lastfm.freetls.fastly.net/i/u/300x300/79eb7925a57079641e698093417efde7.jpg';
        posts[3].text = 'Oooh... Aaaahh.. Aaaaaaaaaaaaaaahh... Who never...? rs.';

        posts[4] = new Post();
        posts[4].number = 5;
        posts[4].title = 'Moby Dick';
        posts[4].album = 'Led Zeppelin II';
        posts[4].cover = 'https://lastfm.freetls.fastly.net/i/u/300x300/79eb7925a57079641e698093417efde7.jpg';
        posts[4].text = 'I`ve never liked drums solo until i hear this song.';
        
        posts[5] = new Post();
        posts[5].number = 6;
        posts[5].title = 'Starway to heaven';
        posts[5].album = 'Led Zeppelin IV';
        posts[5].cover = 'https://lastfm.freetls.fastly.net/i/u/300x300/1e6f99756d0342f891d3233ac1283d21.png';
        posts[5].text = 'i never realy liked this one. But isnt bad. Maybe it`s a poser song.';
        
        posts[6] = new Post();
        posts[6].number = 7;
        posts[6].title = 'The Lemon Song';
        posts[6].album = 'Led Zeppelin II';
        posts[6].cover = 'https://lastfm.freetls.fastly.net/i/u/300x300/79eb7925a57079641e698093417efde7.jpg';
        posts[6].text = 'I`ll just stop adding Led Zeppelin II. I can easely put all album here. But this solo deserves your spot. You`re allowed to be dance wild hearing this.';
        
        posts[7] = new Post();
        posts[7].number = 8;
        posts[7].title = 'Black Dog';
        posts[7].album = 'Led Zeppelin IV';
        posts[7].cover = 'https://lastfm.freetls.fastly.net/i/u/300x300/1e6f99756d0342f891d3233ac1283d21.png';
        posts[7].text = 'Let Jimmy teaches you how to build a fucking riff.';
        
        posts[8] = new Post();
        posts[8].number = 9;
        posts[8].title = 'Immigrant Song';
        posts[8].album = 'Led Zeppelin III';
        posts[8].cover = 'https://lastfm.freetls.fastly.net/i/u/300x300/b3b92b3b5cdc47eec7ed970f3b38346a.png';
        posts[8].text = 'Play this one if you need to chase something really hard.';
        
        posts[9] = new Post();
        posts[9].number = 10;
        posts[9].title = 'Kashmir';
        posts[9].album = 'Physical Graffiti';
        posts[9].cover = 'https://lastfm.freetls.fastly.net/i/u/300x300/614bbb720f134f8bb69d97dca46474e0.jpg';
        posts[9].text = 'An entire album just for this song.';
    res.redirect('/');
});

app.listen(port, () =>{
    console.log(`the server is running on port: ${port}`);
})