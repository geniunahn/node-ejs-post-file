const express = require("express");
const app = express();
const ejs = require("ejs");
// 파일을 읽고 쓸 수 있도록 도와주는 모듈이다.
const fs = require("fs");

// 글 데이터를 임시로 저장하는 변수다. 서버에서 가져온 데이터를 이 변수에 넣은 후 사용한다.
let posts = [];
// 파일 읽기
const readFile = fs.readFileSync("postDB.json", "utf-8");
// 오브젝트 코드로 변환 (제이슨으로 변환된 데이터를 변수에 저장한다.)
const jsonData = JSON.parse(readFile);
// console.log(jsonData);
// posts 에 배열을 복사해 추가한다. 이때 배열 안에 배열을 넣을 순 없으므로 들어가는 배열의 배열을 제거하고 그 안에 있는 요소만 옮긴다. ([[jsonData]] 상태이므로) 그래서 ...jsonData 를 입력한다. 이것을 '배열 합치기' 혹은 '스프레드 연산자'라고 부른다. 배열과 배열을 합치고 싶을 때 사용하는 js 연산자가 존재하는데 그와 같은 맥락의 기능이다.
posts = [...jsonData];
// console.log(posts);

// ejs를 view 엔진으로 설정
app.set("view engine", "ejs");

// 정적파일 경로 지정
app.use(express.static("public"));

// post 방식을 읽을 수 있도록 도와주는 모듈
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// home
app.get("/", function (요청, 응답) {
  응답.render("pages/index.ejs", { posts });
});

// about
app.get("/about", function (req, res) {
  res.render("pages/about.ejs");
});

// 글쓰기 요청 /create
app.post("/create", function (req, res) {
  const 글 = req.body.post;

  // posts 배열에 글 추가
  posts.push(글);
  console.log(posts);
  // posts 배열 데이터를 DB file에 저장
  fs.writeFileSync("postDB.json", JSON.stringify(posts));
  res.redirect("/");
});

// 글 삭제 요청.  form의 action 값과 일치하는 라우팅을 만들었다. /delete/:id 를 사용하면 :id 자리에 들어오는 숫자 값이 req.params.id의 값으로 전달된다.
app.post("/delete/:id", function (req, res) {
  const id = req.params.id;
  console.log(id);
  // 이제 posts 배열의 특정 배열의 값을 삭제한다. 그 다음에  fs.writeFileSync("postDB.json", JSON.stringify(posts));  와   res.redirect("/");  를 함수에 적용하여 DB 문서에도 삭제된 posts 정보를 반영하면 된다.
  posts.splice(id, 1);
  fs.writeFileSync("postDB.json", JSON.stringify(posts));
  res.redirect("/");
});

const port = 3001;
app.listen(port, () => {
  console.log(`server running at ${port}`);
});
