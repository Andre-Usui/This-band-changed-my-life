import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

/* Planos para o blog: 
    1a fase: Criar um blog editável;
    Para este caso, irei fazer um blog de fã base, dizendo qual música é sua favorita e porque.

        - Fase de criação: 
            - Permitir inserir o Title:
                - Title será representado no H1 e no nome da página (HEAD)
                - buscar formas ou estratégias para que esta seja a primeira página
                mas apenas caso o title não tenha sido registrado.
####################
*/

var blogTitle = {n: ''};   // colocar todas estas variáveis em um único objeto.
//var edit = false;
var editPost;
const posts = [];

function Post(number, title, text, edit) {
    this.number = NaN;
    this.title = '';
    this.text = '';
    this.edit = false;
};



app.get('/', (req, res) => {
    if (blogTitle.n === '') { 
        res.render('start.ejs', ({blogTitle, posts})); //edit removed
    }else {
        res.render('index.ejs', ({blogTitle, posts}));//edit removed
    };
});

app.get('/aboutus', (req, res) => {
    res.render('aboutUs.ejs', ({blogTitle, posts}));//edit removed

});

app.post('/login', (req, res) => {
    blogTitle.n = "Led Zeppelin";
    posts[0] = new Post();
    posts[0].number = 1;
    posts[0].title = 'Dazed and Confuse';
    posts[0].text = 'This song was my number 1 on my tests on this site. Also it is the favorite Led`s music of a friend.';
    posts[1] = new Post();
    posts[1].number = 2;
    posts[1].title = 'Babe, Im gonna leave you';
    posts[1].text = 'The most beatiful guitar fingering on the entire rockn roll story. I never loose a chance to play this song when i have a guitar on my couch.';
    posts[2] = new Post();
    posts[2].number = 3;
    posts[2].title = 'Good Times, Bad Times';
    posts[2].text = 'The first song of Led in life if you are an album listener fan.'
    posts[3] = new Post();
    posts[3].number = 4;
    posts[3].title = 'Whole lotta love';
    posts[3].text = 'Oooh... Aaaahh.. Aaaaaaaaaaaaaaahh... Who never...? rs.'
    posts[4] = new Post();
    posts[4].number = 5;
    posts[4].title = 'Moby Dick';
    posts[4].text = 'I`ve never liked drums solo until i hear this song.'
    posts[5] = new Post();
    posts[5].number = 6;
    posts[5].title = 'Starway to heaven';
    posts[5].text = 'i never realy liked this one. But isnt bad. Maybe it`s a poser song.'
    posts[6] = new Post();
    posts[6].number = 7;
    posts[6].title = 'The Lemon Song';
    posts[6].text = 'I`ll just stop adding Led Zeppelin II. I can easely put all album here. But this solo deserves your spot. You`re allowed to be dance wild hearing this.'
    posts[7] = new Post();
    posts[7].number = 8;
    posts[7].title = 'Black Dog';
    posts[7].text = 'Let Jimmy teaches you how to build a fucking riff.';
    posts[8] = new Post();
    posts[8].number = 9;
    posts[8].title = 'Immigrant Song';
    posts[8].text = 'Play this one if you need to chase something really hard.'
    posts[9] = new Post();
    posts[9].number = 10;
    posts[9].title = 'Kashmir';
    posts[9].text = 'An entire album just for this song.';
    //aprimorar isto.

    res.render('index.ejs', ({blogTitle, posts}));//edit removed

});

app.post('/submitTitle', (req, res) =>{
    blogTitle.n = req.body["blogTitleStart"];
    res.render('index.ejs', ({blogTitle, posts})); //edit removed
});

app.post('/submitPost', (req, res) =>{  //gerando post
    console.log(`the submitPost has been called`);
    function generatePostObject() {
        for (var i = 0; i <= posts.length; i++) { 
            if (!posts[i]) {
                posts[i] = new Post();
                posts[i].number = (i + 1);
                posts[i].title = req.body["postTitle"];
                posts[i].text = req.body["postText"];;
                i++;
                console.log(`the submitPost has ended`);
            };
        };
    };
       
    generatePostObject();

    res.render('index.ejs', ({blogTitle, posts}));//edit removed
}); 

app.post('/submitEdit', (req, res) =>{        
    editPost = posts[(req.body.postNum - 1)];  
    editPost.edit = true;
    res.render('index.ejs', ({blogTitle, posts, editPost})); //edit removed
});

app.post('/submitEditComplete', (req, res) =>{     
    editPost.title = req.body.postTitle;
    editPost.text = req.body.postText;   
    editPost.edit = false;
    res.render('index.ejs', ({blogTitle, posts, editPost})); //edit removed
});

app.post('/submitDelete', (req, res) =>{ 
    var numDelete = (req.body.postNum - 1)
    for(var i = 0; i < posts.length ; i++){
        if (posts[i].number > posts[numDelete].number){
            posts[i].number = i;
        };
    };
    posts.splice(numDelete, 1);
    res.render('index.ejs', ({blogTitle, posts})); //edit removed
});

/*          - Post Creation:
                - permitir criação de novos posts
                    - cada post deve ser um container? 
                    - cada post deve ter o botão de editar e excluir
                    - function object constructor
                        - ideal para construir padrões
                - app.post
                - ejs loop post.length?
####################
*/



/*          - Post Viewing (HOME):
                - No Home você pode ver todas as postagens. 
                - No Home você também têm de ter acesso às funcionalidades.
####################                
*/

/*          - Post Update / Delete: 
                - Deve ser possível editar as postagens
                    - ter acesso ao texto string registrado
                - Deve ser possível excluir as postagens
                    - app.delete
                    - confirmação de antes de efetuar o delete 
####################                      
*/




app.listen(port, () =>{
    console.log(`the server is running on port: ${port}`);
})


/*
    2a fase: fazer um construtor de blog;
    3a fase: Iloveyoulist. Faça uma carta elogiando boas características e dando oportunidade para
    a pessoa continuar a escrever características.
*/
