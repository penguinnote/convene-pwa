// 강의별 말씀 본문. 정적 데이터.
// 각 item의 id는 스케줄 link(verseId)·상세 라우트(/verses/:id)와 매칭되는 안정적 키다.
//   주제 강의 1~5강 → topic-1~5, 개회 → opening, 폐회 → closing,
//   GBS 1~3강 → gbs-1~3, 새벽(아침묵상) 1~3강 → dawn-1~3.
// 본문 text/textEn는 추후 입력한다(비어 있으면 상세에서 "준비 중" 폴백).
export const verseGroups = [
  {
    group: "주제 강의",
    groupEn: "Topic Lectures",
    items: [
      {
        id: "topic-1",
        label: "1강",
        title: "나도 너를 정죄하지 아니하노니",
        titleEn: "Neither Do I Condemn You",
        passages: [
          {
            ref: "요한복음 8:1-12, 31-32",
            refEn: "John 8:1-12, 31-32",
            text: `1 예수는 감람 산으로 가시니라
2 아침에 다시 성전으로 들어오시니 백성이 다 나아오는지라 앉으사 그들을 가르치시더니
3 서기관들과 바리새인들이 음행중에 잡힌 여자를 끌고 와서 가운데 세우고
4 예수께 말하되 선생이여 이 여자가 간음하다가 현장에서 잡혔나이다
5 모세는 율법에 이러한 여자를 돌로 치라 명하였거니와 선생은 어떻게 말하겠나이까
6 그들이 이렇게 말함은 고발할 조건을 얻고자 하여 예수를 시험함이러라 예수께서 몸을 굽히사 손가락으로 땅에 쓰시니
7 그들이 묻기를 마지 아니하는지라 이에 일어나 이르시되 너희 중에 죄 없는 자가 먼저 돌로 치라 하시고
8 다시 몸을 굽혀 손가락으로 땅에 쓰시니
9 그들이 이 말씀을 듣고 양심에 가책을 느껴 어른으로 시작하여 젊은이까지 하나씩 하나씩 나가고 오직 예수와 그 가운데 섰는 여자만 남았더라
10 예수께서 일어나사 여자 외에 아무도 없는 것을 보시고 이르시되 여자여 너를 고발하던 그들이 어디 있느냐 너를 정죄한 자가 없느냐
11 대답하되 주여 없나이다 예수께서 이르시되 나도 너를 정죄하지 아니하노니 가서 다시는 죄를 범하지 말라 하시니라
12 예수께서 또 말씀하여 이르시되 나는 세상의 빛이니 나를 따르는 자는 어둠에 다니지 아니하고 생명의 빛을 얻으리라

31 그러므로 예수께서 자기를 믿은 유대인들에게 이르시되 너희가 내 말에 거하면 참으로 내 제자가 되고
32 진리를 알지니 진리가 너희를 자유롭게 하리라`,
            textEn: `1 but Jesus went to the Mount of Olives.
2 At dawn he appeared again in the temple courts, where all the people gathered around him, and he sat down to teach them.
3 The teachers of the law and the Pharisees brought in a woman caught in adultery. They made her stand before the group
4 and said to Jesus, "Teacher, this woman was caught in the act of adultery.
5 In the Law Moses commanded us to stone such women. Now what do you say?"
6 They were using this question as a trap, in order to have a basis for accusing him. But Jesus bent down and started to write on the ground with his finger.
7 When they kept on questioning him, he straightened up and said to them, "Let any one of you who is without sin be the first to throw a stone at her."
8 Again he stooped down and wrote on the ground.
9 At this, those who heard began to go away one at a time, the older ones first, until only Jesus was left, with the woman still standing there.
10 Jesus straightened up and asked her, "Woman, where are they? Has no one condemned you?"
11 "No one, sir," she said. "Then neither do I condemn you," Jesus declared. "Go now and leave your life of sin."
12 When Jesus spoke again to the people, he said, "I am the light of the world. Whoever follows me will never walk in darkness, but will have the light of life."

31 To the Jews who had believed him, Jesus said, "If you hold to my teaching, you are really my disciples.
32 Then you will know the truth, and the truth will set you free."`,
          },
        ],
      },
      {
        id: "topic-2",
        label: "2강",
        title: "이 내 아들은 잃었다가 다시 얻었노라",
        titleEn: "This Son of Mine Was Lost and Is Found",
        passages: [
          {
            ref: "누가복음 15:1-32",
            refEn: "Luke 15:1-32",
            text: `1 모든 세리와 죄인들이 말씀을 들으러 가까이 나아오니
2 바리새인과 서기관들이 수군거려 이르되 이 사람이 죄인을 영접하고 음식을 같이 먹는다 하더라
3 예수께서 그들에게 이 비유로 이르시되
4 너희 중에 어떤 사람이 양 백 마리가 있는데 그 중의 하나를 잃으면 아흔아홉 마리를 들에 두고 그 잃은 것을 찾아내기까지 찾아다니지 아니하겠느냐
5 또 찾아낸즉 즐거워 어깨에 메고
6 집에 와서 그 벗과 이웃을 불러 모으고 말하되 나와 함께 즐기자 나의 잃은 양을 찾아내었노라 하리라
7 내가 너희에게 이르노니 이와 같이 죄인 한 사람이 회개하면 하늘에서는 회개할 것 없는 의인 아흔아홉으로 말미암아 기뻐하는 것보다 더하리라
8 어떤 여자가 열 드라크마가 있는데 하나를 잃으면 등불을 켜고 집을 쓸며 찾아내기까지 부지런히 찾지 아니하겠느냐
9 또 찾아낸즉 벗과 이웃을 불러 모으고 말하되 나와 함께 즐기자 잃은 드라크마를 찾아내었노라 하리라
10 내가 너희에게 이르노니 이와 같이 죄인 한 사람이 회개하면 하나님의 사자들 앞에 기쁨이 되느니라
11 또 이르시되 어떤 사람에게 두 아들이 있는데
12 그 둘째가 아버지에게 말하되 아버지여 재산 중에서 내게 돌아올 분깃을 내게 주소서 하는지라 아버지가 그 살림을 각각 나눠 주었더니
13 그 후 며칠이 안 되어 둘째 아들이 재물을 다 모아 가지고 먼 나라에 가 거기서 허랑방탕하여 그 재산을 낭비하더니
14 다 없앤 후 그 나라에 크게 흉년이 들어 그가 비로소 궁핍한지라
15 가서 그 나라 백성 중 한 사람에게 붙여 사니 그가 그를 들로 보내어 돼지를 치게 하였는데
16 그가 돼지 먹는 쥐엄 열매로 배를 채우고자 하되 주는 자가 없는지라
17 이에 스스로 돌이켜 이르되 내 아버지에게는 양식이 풍족한 품꾼이 얼마나 많은가 나는 여기서 주려 죽는구나
18 내가 일어나 아버지께 가서 이르기를 아버지 내가 하늘과 아버지께 죄를 지었사오니
19 지금부터는 아버지의 아들이라 일컬음을 감당하지 못하겠나이다 나를 품꾼의 하나로 보소서 하리라 하고
20 이에 일어나서 아버지께로 돌아가니라 아직도 거리가 먼데 아버지가 그를 보고 측은히 여겨 달려가 목을 안고 입을 맞추니
21 아들이 이르되 아버지 내가 하늘과 아버지께 죄를 지었사오니 지금부터는 아버지의 아들이라 일컬음을 감당하지 못하겠나이다 하나
22 아버지는 종들에게 이르되 제일 좋은 옷을 내어다가 입히고 손에 가락지를 끼우고 발에 신을 신기라
23 그리고 살진 송아지를 끌어다가 잡으라 우리가 먹고 즐기자
24 이 내 아들은 죽었다가 다시 살아났으며 내가 잃었다가 다시 얻었노라 하니 그들이 즐거워하더라
25 맏아들은 밭에 있다가 돌아와 집에 가까이 왔을 때에 풍악과 춤추는 소리를 듣고
26 한 종을 불러 이 무슨 일인가 물은대
27 대답하되 당신의 동생이 돌아왔으매 당신의 아버지가 건강한 그를 다시 맞아들이게 됨으로 인하여 살진 송아지를 잡았나이다 하니
28 그가 노하여 들어가고자 하지 아니하거늘 아버지가 나와서 권한대
29 아버지께 대답하여 이르되 내가 여러 해 아버지를 섬겨 명을 어김이 없거늘 내게는 염소 새끼라도 주어 나와 내 벗으로 즐기게 하신 일이 없더니
30 아버지의 살림을 창녀들과 함께 삼켜 버린 이 아들이 돌아오매 이를 위하여 살진 송아지를 잡으셨나이다
31 아버지가 이르되 얘 너는 항상 나와 함께 있으니 내 것이 다 네 것이로되
32 이 네 동생은 죽었다가 살아났으며 내가 잃었다가 얻었기로 우리가 즐거워하고 기뻐하는 것이 마땅하다 하니라`,
            textEn: `1 Now the tax collectors and sinners were all gathering around to hear Jesus.
2 But the Pharisees and the teachers of the law muttered, "This man welcomes sinners and eats with them."
3 Then Jesus told them this parable:
4 "Suppose one of you has a hundred sheep and loses one of them. Doesn't he leave the ninety-nine in the open country and go after the lost sheep until he finds it?
5 And when he finds it, he joyfully puts it on his shoulders
6 and goes home. Then he calls his friends and neighbors together and says, 'Rejoice with me; I have found my lost sheep.'
7 I tell you that in the same way there will be more rejoicing in heaven over one sinner who repents than over ninety-nine righteous persons who do not need to repent.
8 "Or suppose a woman has ten silver coins and loses one. Doesn't she light a lamp, sweep the house and search carefully until she finds it?
9 And when she finds it, she calls her friends and neighbors together and says, 'Rejoice with me; I have found my lost coin.'
10 In the same way, I tell you, there is rejoicing in the presence of the angels of God over one sinner who repents."
11 Jesus continued: "There was a man who had two sons.
12 The younger one said to his father, 'Father, give me my share of the estate.' So he divided his property between them.
13 "Not long after that, the younger son got together all he had, set off for a distant country and there squandered his wealth in wild living.
14 After he had spent everything, there was a severe famine in that whole country, and he began to be in need.
15 So he went and hired himself out to a citizen of that country, who sent him to his fields to feed pigs.
16 He longed to fill his stomach with the pods that the pigs were eating, but no one gave him anything.
17 "When he came to his senses, he said, 'How many of my father's hired servants have food to spare, and here I am starving to death!
18 I will set out and go back to my father and say to him: Father, I have sinned against heaven and against you.
19 I am no longer worthy to be called your son; make me like one of your hired servants.'
20 So he got up and went to his father. But while he was still a long way off, his father saw him and was filled with compassion for him; he ran to his son, threw his arms around him and kissed him.
21 "The son said to him, 'Father, I have sinned against heaven and against you. I am no longer worthy to be called your son.'
22 "But the father said to his servants, 'Quick! Bring the best robe and put it on him. Put a ring on his finger and sandals on his feet.
23 Bring the fattened calf and kill it. Let's have a feast and celebrate.
24 For this son of mine was dead and is alive again; he was lost and is found.' So they began to celebrate.
25 "Meanwhile, the older son was in the field. When he came near the house, he heard music and dancing.
26 So he called one of the servants and asked him what was going on.
27 'Your brother has come,' he replied, 'and your father has killed the fattened calf because he has him back safe and sound.'
28 "The older brother became angry and refused to go in. So his father went out and pleaded with him.
29 But he answered his father, 'Look! All these years I've been slaving for you and never disobeyed your orders. Yet you never gave me even a young goat so I could celebrate with my friends.
30 But when this son of yours who has squandered your property with prostitutes comes home, you kill the fattened calf for him!'
31 "'My son,' the father said, 'you are always with me, and everything I have is yours.
32 But we had to celebrate and be glad, because this brother of yours was dead and is alive again; he was lost and is found.'"`,
          },
        ],
      },
      {
        id: "topic-3",
        label: "3강",
        title: "네 이름이 무엇이냐?",
        titleEn: "What Is Your Name?",
        passages: [
          {
            ref: "마가복음 5:1-20",
            refEn: "Mark 5:1-20",
            text: `1 예수께서 바다 건너편 거라사인의 지방에 이르러
2 배에서 나오시매 곧 더러운 귀신 들린 사람이 무덤 사이에서 나와 예수를 만나니라
3 그 사람은 무덤 사이에 거처하는데 이제는 아무도 그를 쇠사슬로도 맬 수 없게 되었으니
4 이는 여러 번 고랑과 쇠사슬에 매였어도 쇠사슬을 끊고 고랑을 깨뜨렸음이러라 그리하여 아무도 그를 제어할 힘이 없는지라
5 밤낮 무덤 사이에서나 산에서나 늘 소리 지르며 돌로 자기의 몸을 해치고 있었더라
6 그가 멀리서 예수를 보고 달려와 절하며
7 큰 소리로 부르짖어 이르되 지극히 높으신 하나님의 아들 예수여 나와 당신이 무슨 상관이 있나이까 원하건대 하나님 앞에 맹세하고 나를 괴롭히지 마옵소서 하니
8 이는 예수께서 이미 그에게 이르시기를 더러운 귀신아 그 사람에게서 나오라 하셨음이라
9 이에 물으시되 네 이름이 무엇이냐 이르되 내 이름은 군대니 우리가 많음이니이다 하고
10 자기를 그 지방에서 내보내지 마시기를 간구하더니
11 마침 거기 돼지의 큰 떼가 산 곁에서 먹고 있는지라
12 이에 간구하여 이르되 우리를 돼지에게로 보내어 들어가게 하소서 하니
13 허락하신대 더러운 귀신들이 나와서 돼지에게로 들어가매 거의 이천 마리 되는 떼가 바다를 향하여 비탈로 내리달아 바다에서 몰사하거늘
14 치던 자들이 도망하여 읍내와 여러 마을에 말하니 사람들이 어떻게 되었는지를 보러 와서
15 예수께 이르러 그 귀신 들렸던 자 곧 군대 귀신 지폈던 자가 옷을 입고 정신이 온전하여 앉은 것을 보고 두려워하더라
16 이에 귀신 들렸던 자가 당한 것과 돼지의 일을 본 자들이 그들에게 알리매
17 그들이 예수께 그 지방에서 떠나시기를 간구하더라
18 예수께서 배에 오르실 때에 귀신 들렸던 사람이 함께 있기를 간구하였으나
19 허락하지 아니하시고 그에게 이르시되 집으로 돌아가 주께서 네게 어떻게 큰 일을 행하사 너를 불쌍히 여기신 것을 네 가족에게 알리라 하시니
20 그가 가서 예수께서 자기에게 어떻게 큰 일 행하셨는지를 데가볼리에 전파하니 모든 사람이 놀랍게 여기더라`,
            textEn: `1 They went across the lake to the region of the Gerasenes.
2 When Jesus got out of the boat, a man with an impure spirit came from the tombs to meet him.
3 This man lived in the tombs, and no one could bind him anymore, not even with a chain.
4 For he had often been chained hand and foot, but he tore the chains apart and broke the irons on his feet. No one was strong enough to subdue him.
5 Night and day among the tombs and in the hills he would cry out and cut himself with stones.
6 When he saw Jesus from a distance, he ran and fell on his knees in front of him.
7 He shouted at the top of his voice, "What do you want with me, Jesus, Son of the Most High God? In God's name don't torture me!"
8 For Jesus had said to him, "Come out of this man, you impure spirit!"
9 Then Jesus asked him, "What is your name?" "My name is Legion," he replied, "for we are many."
10 And he begged Jesus again and again not to send them out of the area.
11 A large herd of pigs was feeding on the nearby hillside.
12 The demons begged Jesus, "Send us among the pigs; allow us to go into them."
13 He gave them permission, and the impure spirits came out and went into the pigs. The herd, about two thousand in number, rushed down the steep bank into the lake and were drowned.
14 Those tending the pigs ran off and reported this in the town and countryside, and the people went out to see what had happened.
15 When they came to Jesus, they saw the man who had been possessed by the legion of demons, sitting there, dressed and in his right mind; and they were afraid.
16 Those who had seen it told the people what had happened to the demon-possessed man—and told about the pigs as well.
17 Then the people began to plead with Jesus to leave their region.
18 As Jesus was getting into the boat, the man who had been demon-possessed begged to go with him.
19 Jesus did not let him, but said, "Go home to your own people and tell them how much the Lord has done for you, and how he has had mercy on you."
20 So the man went away and began to tell in the Decapolis how much Jesus had done for him. And all the people were amazed.`,
          },
        ],
      },
      {
        id: "topic-4",
        label: "4강",
        title: "오늘 네가 나와 함께 낙원에 있으리라",
        titleEn: "Today You Will Be With Me in Paradise",
        passages: [
          {
            ref: "누가복음 23:1-49",
            refEn: "Luke 23:1-49",
            text: `1 무리가 다 일어나 예수를 빌라도에게 끌고 가서
2 고발하여 이르되 우리가 이 사람을 보매 우리 백성을 미혹하고 가이사에게 세금 바치는 것을 금하며 자칭 왕 그리스도라 하더이다 하니
3 빌라도가 예수께 물어 이르되 네가 유대인의 왕이냐 대답하여 이르시되 네 말이 옳도다
4 빌라도가 대제사장들과 무리에게 이르되 내가 보니 이 사람에게 죄가 없도다 하니
5 무리가 더욱 강하게 말하되 그가 온 유대에서 가르치고 갈릴리에서부터 시작하여 여기까지 와서 백성을 소동하게 하나이다
6 빌라도가 듣고 그가 갈릴리 사람이냐 물어
7 헤롯의 관할에 속한 줄을 알고 헤롯에게 보내니 그 때에 헤롯이 예루살렘에 있더라
8 헤롯이 예수를 보고 매우 기뻐하니 이는 그의 소문을 들었으므로 보고자 한 지 오래였고 또한 무엇이나 이적 행하심을 볼까 바랐던 연고러라
9 여러 말로 물으나 아무 말도 대답하지 아니하시니
10 대제사장들과 서기관들이 서서 힘써 고발하더라
11 헤롯이 그 군인들과 함께 예수를 업신여기며 희롱하고 빛난 옷을 입혀 빌라도에게 도로 보내니
12 헤롯과 빌라도가 전에는 원수였으나 당일에 서로 친구가 되니라
13 빌라도가 대제사장들과 관리들과 백성을 불러 모으고
14 이르되 너희가 이 사람이 백성을 미혹하는 자라 하여 내게 끌고 왔도다 보라 내가 너희 앞에서 심문하였으되 너희가 고발하는 일에 대하여 이 사람에게서 죄를 찾지 못하였고
15 헤롯이 또한 그렇게 하여 그를 우리에게 도로 보내었도다 보라 그가 행한 일에는 죽일 일이 없느니라
16 그러므로 때려서 놓겠노라
17 (없음)
18 무리가 일제히 소리 질러 이르되 이 사람을 없이하고 바라바를 우리에게 놓아 주소서 하니
19 이 바라바는 성중에서 일어난 민란과 살인으로 말미암아 옥에 갇힌 자러라
20 빌라도는 예수를 놓고자 하여 다시 그들에게 말하되
21 그들은 소리 질러 이르되 그를 십자가에 못 박게 하소서 십자가에 못 박게 하소서 하는지라
22 빌라도가 세 번째 말하되 이 사람이 무슨 악한 일을 하였느냐 나는 그에게서 죽일 죄를 찾지 못하였나니 때려서 놓으리라 하니
23 그들이 큰 소리로 재촉하여 십자가에 못 박기를 구하니 그들의 소리가 이긴지라
24 이에 빌라도가 그들이 구하는 대로 하기를 언도하고
25 그들이 요구하는 자 곧 민란과 살인으로 말미암아 옥에 갇힌 자를 놓아 주고 예수는 넘겨 주어 그들의 뜻대로 하게 하니라
26 그들이 예수를 끌고 갈 때에 시몬이라는 구레네 사람이 시골에서 오는 것을 붙들어 그에게 십자가를 지워 예수를 따르게 하더라
27 또 백성과 및 그를 위하여 가슴을 치며 슬피 우는 여자의 큰 무리가 따라오는지라
28 예수께서 돌이켜 그들을 향하여 이르시되 예루살렘의 딸들아 나를 위하여 울지 말고 너희와 너희 자녀를 위하여 울라
29 보라 날이 이르면 사람이 말하기를 잉태하지 못하는 이와 해산하지 못한 배와 먹이지 못한 젖이 복이 있다 하리라
30 그 때에 사람이 산들을 대하여 우리 위에 무너지라 하며 작은 산들을 대하여 우리를 덮으라 하리라
31 푸른 나무에도 이같이 하거든 마른 나무에는 어떻게 되리요 하시니라
32 또 다른 두 행악자도 사형을 받게 되어 예수와 함께 끌려 가니라
33 해골이라 하는 곳에 이르러 거기서 예수를 십자가에 못 박고 두 행악자도 그렇게 하니 하나는 우편에, 하나는 좌편에 있더라
34 이에 예수께서 이르시되 아버지 저들을 사하여 주옵소서 자기들이 하는 것을 알지 못함이니이다 하시더라 그들이 그의 옷을 나눠 제비 뽑을새
35 백성은 서서 구경하는데 관리들은 비웃어 이르되 저가 남을 구원하였으니 만일 하나님이 택하신 자 그리스도이면 자신도 구원할지어다 하고
36 군인들도 희롱하면서 나아와 신 포도주를 주며
37 이르되 네가 만일 유대인의 왕이면 네가 너를 구원하라 하더라
38 그의 위에 이는 유대인의 왕이라 쓴 패가 있더라
39 달린 행악자 중 하나는 비방하여 이르되 네가 그리스도가 아니냐 너와 우리를 구원하라 하되
40 하나는 그 사람을 꾸짖어 이르되 네가 동일한 정죄를 받고서도 하나님을 두려워하지 아니하느냐
41 우리는 우리가 행한 일에 상당한 보응을 받는 것이니 이에 당연하거니와 이 사람이 행한 것은 옳지 않은 것이 없느니라 하고
42 이르되 예수여 당신의 나라에 임하실 때에 나를 기억하소서 하니
43 예수께서 이르시되 내가 진실로 네게 이르노니 오늘 네가 나와 함께 낙원에 있으리라 하시니라
44 때가 제육시쯤 되어 해가 빛을 잃고 온 땅에 어둠이 임하여 제구시까지 계속하며
45 성소의 휘장이 한가운데가 찢어지더라
46 예수께서 큰 소리로 불러 이르시되 아버지 내 영혼을 아버지 손에 부탁하나이다 하고 이 말씀을 하신 후 숨지시니라
47 백부장이 그 된 일을 보고 하나님께 영광을 돌려 이르되 이 사람은 정녕 의인이었도다 하고
48 이를 구경하러 모인 무리도 그 된 일을 보고 다 가슴을 치며 돌아가고
49 예수를 아는 자들과 갈릴리로부터 따라온 여자들도 다 멀리 서서 이 일을 보니라`,
            textEn: `1 Then the whole assembly rose and led him off to Pilate.
2 And they began to accuse him, saying, "We have found this man subverting our nation. He opposes payment of taxes to Caesar and claims to be Messiah, a king."
3 So Pilate asked Jesus, "Are you the king of the Jews?" "You have said so," Jesus replied.
4 Then Pilate announced to the chief priests and the crowd, "I find no basis for a charge against this man."
5 But they insisted, "He stirs up the people all over Judea by his teaching. He started in Galilee and has come all the way here."
6 On hearing this, Pilate asked if the man was a Galilean.
7 When he learned that Jesus was under Herod's jurisdiction, he sent him to Herod, who was also in Jerusalem at that time.
8 When Herod saw Jesus, he was greatly pleased, because for a long time he had been wanting to see him. From what he had heard about him, he hoped to see him perform a sign of some sort.
9 He plied him with many questions, but Jesus gave him no answer.
10 The chief priests and the teachers of the law were standing there, vehemently accusing him.
11 Then Herod and his soldiers ridiculed and mocked him. Dressing him in an elegant robe, they sent him back to Pilate.
12 That day Herod and Pilate became friends—before this they had been enemies.
13 Pilate called together the chief priests, the rulers and the people,
14 and said to them, "You brought me this man as one who was inciting the people to rebellion. I have examined him in your presence and have found no basis for your charges against him.
15 Neither has Herod, for he sent him back to us; as you can see, he has done nothing to deserve death.
16 Therefore, I will punish him and then release him."

18 But the whole crowd shouted, "Away with this man! Release Barabbas to us!"
19 (Barabbas had been thrown into prison for an insurrection in the city, and for murder.)
20 Wanting to release Jesus, Pilate appealed to them again.
21 But they kept shouting, "Crucify him! Crucify him!"
22 For the third time he spoke to them: "Why? What crime has this man committed? I have found in him no grounds for the death penalty. Therefore I will have him punished and then release him."
23 But with loud shouts they insistently demanded that he be crucified, and their shouts prevailed.
24 So Pilate decided to grant their demand.
25 He released the man who had been thrown into prison for insurrection and murder, the one they asked for, and surrendered Jesus to their will.
26 As the soldiers led him away, they seized Simon from Cyrene, who was on his way in from the country, and put the cross on him and made him carry it behind Jesus.
27 A large number of people followed him, including women who mourned and wailed for him.
28 Jesus turned and said to them, "Daughters of Jerusalem, do not weep for me; weep for yourselves and for your children.
29 For the time will come when you will say, 'Blessed are the childless women, the wombs that never bore and the breasts that never nursed!'
30 Then "'they will say to the mountains, "Fall on us!" and to the hills, "Cover us!"'
31 For if people do these things when the tree is green, what will happen when it is dry?"
32 Two other men, both criminals, were also led out with him to be executed.
33 When they came to the place called the Skull, they crucified him there, along with the criminals—one on his right, the other on his left.
34 Jesus said, "Father, forgive them, for they do not know what they are doing." And they divided up his clothes by casting lots.
35 The people stood watching, and the rulers even sneered at him. They said, "He saved others; let him save himself if he is God's Messiah, the Chosen One."
36 The soldiers also came up and mocked him. They offered him wine vinegar
37 and said, "If you are the king of the Jews, save yourself."
38 There was a written notice above him, which read: this is the king of the jews.
39 One of the criminals who hung there hurled insults at him: "Aren't you the Messiah? Save yourself and us!"
40 But the other criminal rebuked him. "Don't you fear God," he said, "since you are under the same sentence?
41 We are punished justly, for we are getting what our deeds deserve. But this man has done nothing wrong."
42 Then he said, "Jesus, remember me when you come into your kingdom. "
43 Jesus answered him, "Truly I tell you, today you will be with me in paradise."
44 It was now about noon, and darkness came over the whole land until three in the afternoon,
45 for the sun stopped shining. And the curtain of the temple was torn in two.
46 Jesus called out with a loud voice, "Father, into your hands I commit my spirit." When he had said this, he breathed his last.
47 The centurion, seeing what had happened, praised God and said, "Surely this was a righteous man."
48 When all the people who had gathered to witness this sight saw what took place, they beat their breasts and went away.
49 But all those who knew him, including the women who had followed him from Galilee, stood at a distance, watching these things.`,
          },
        ],
      },
      {
        id: "topic-5",
        label: "5강",
        title: "나도 너희를 보내노라",
        titleEn: "I Am Sending You",
        passages: [
          {
            ref: "요한복음 20:19-23",
            refEn: "John 20:19-23",
            text: `19 이 날 곧 안식 후 첫날 저녁 때에 제자들이 유대인들을 두려워하여 모인 곳의 문들을 닫았더니 예수께서 오사 가운데 서서 이르시되 너희에게 평강이 있을지어다
20 이 말씀을 하시고 손과 옆구리를 보이시니 제자들이 주를 보고 기뻐하더라
21 예수께서 또 이르시되 너희에게 평강이 있을지어다 아버지께서 나를 보내신 것 같이 나도 너희를 보내노라
22 이 말씀을 하시고 그들을 향하사 숨을 내쉬며 이르시되 성령을 받으라
23 너희가 누구의 죄든지 사하면 사하여질 것이요 누구의 죄든지 그대로 두면 그대로 있으리라 하시니라`,
            textEn: `19 On the evening of that first day of the week, when the disciples were together, with the doors locked for fear of the Jewish leaders, Jesus came and stood among them and said, "Peace be with you!"
20 After he said this, he showed them his hands and side. The disciples were overjoyed when they saw the Lord.
21 Again Jesus said, "Peace be with you! As the Father has sent me, I am sending you."
22 And with that he breathed on them and said, "Receive the Holy Spirit.
23 If you forgive anyone's sins, their sins are forgiven; if you do not forgive them, they are not forgiven."`,
          },
        ],
      },
    ],
  },
  {
    group: "개회·폐회 메시지",
    groupEn: "Opening & Closing",
    items: [
      {
        id: "opening",
        label: "개회",
        title: "아담아 네가 어디 있느냐?",
        titleEn: "Where Are You?",
        passages: [
          {
            ref: "창세기 3:9",
            refEn: "Genesis 3:9",
            text: `9 여호와 하나님이 아담을 부르시며 그에게 이르시되 네가 어디 있느냐`,
            textEn: `9 But the Lord God called to the man, "Where are you?"`,
          },
        ],
      },
      {
        id: "closing",
        label: "폐회",
        title: "너희는 가지니",
        titleEn: "You Are the Branches",
        passages: [
          {
            ref: "요한복음 15:1-27",
            refEn: "John 15:1-27",
            text: `1 나는 참포도나무요 내 아버지는 농부라
2 무릇 내게 붙어 있어 열매를 맺지 아니하는 가지는 아버지께서 그것을 제거해 버리시고 무릇 열매를 맺는 가지는 더 열매를 맺게 하려 하여 그것을 깨끗하게 하시느니라
3 너희는 내가 일러준 말로 이미 깨끗하여졌으니
4 내 안에 거하라 나도 너희 안에 거하리라 가지가 포도나무에 붙어 있지 아니하면 스스로 열매를 맺을 수 없음 같이 너희도 내 안에 있지 아니하면 그러하리라
5 나는 포도나무요 너희는 가지라 그가 내 안에, 내가 그 안에 거하면 사람이 열매를 많이 맺나니 나를 떠나서는 너희가 아무 것도 할 수 없음이라
6 사람이 내 안에 거하지 아니하면 가지처럼 밖에 버려져 마르나니 사람들이 그것을 모아다가 불에 던져 사르느니라
7 너희가 내 안에 거하고 내 말이 너희 안에 거하면 무엇이든지 원하는 대로 구하라 그리하면 이루리라
8 너희가 열매를 많이 맺으면 내 아버지께서 영광을 받으실 것이요 너희는 내 제자가 되리라
9 아버지께서 나를 사랑하신 것 같이 나도 너희를 사랑하였으니 나의 사랑 안에 거하라
10 내가 아버지의 계명을 지켜 그의 사랑 안에 거하는 것 같이 너희도 내 계명을 지키면 내 사랑 안에 거하리라
11 내가 이것을 너희에게 이름은 내 기쁨이 너희 안에 있어 너희 기쁨을 충만하게 하려 함이라
12 내 계명은 곧 내가 너희를 사랑한 것 같이 너희도 서로 사랑하라 하는 이것이니라
13 사람이 친구를 위하여 자기 목숨을 버리면 이보다 더 큰 사랑이 없나니
14 너희는 내가 명하는 대로 행하면 곧 나의 친구라
15 이제부터는 너희를 종이라 하지 아니하리니 종은 주인이 하는 것을 알지 못함이라 너희를 친구라 하였노니 내가 내 아버지께 들은 것을 다 너희에게 알게 하였음이라
16 너희가 나를 택한 것이 아니요 내가 너희를 택하여 세웠나니 이는 너희로 가서 열매를 맺게 하고 또 너희 열매가 항상 있게 하여 내 이름으로 아버지께 무엇을 구하든지 다 받게 하려 함이라
17 내가 이것을 너희에게 명함은 너희로 서로 사랑하게 하려 함이라
18 세상이 너희를 미워하면 너희보다 먼저 나를 미워한 줄을 알라
19 너희가 세상에 속하였으면 세상이 자기의 것을 사랑할 것이나 너희는 세상에 속한 자가 아니요 도리어 내가 너희를 세상에서 택하였기 때문에 세상이 너희를 미워하느니라
20 내가 너희에게 종이 주인보다 더 크지 못하다 한 말을 기억하라 사람들이 나를 박해하였은즉 너희도 박해할 것이요 내 말을 지켰은즉 너희 말도 지킬 것이라
21 그러나 사람들이 내 이름으로 말미암아 이 모든 일을 너희에게 하리니 이는 나를 보내신 이를 알지 못함이라
22 내가 와서 그들에게 말하지 아니하였더라면 죄가 없었으려니와 지금은 그 죄를 핑계할 수 없느니라
23 나를 미워하는 자는 또 내 아버지를 미워하느니라
24 내가 아무도 못한 일을 그들 중에서 하지 아니하였더라면 그들에게 죄가 없었으려니와 지금은 그들이 나와 내 아버지를 보았고 또 미워하였도다
25 그러나 이는 그들의 율법에 기록된 바 그들이 이유 없이 나를 미워하였다 한 말을 응하게 하려 함이라
26 내가 아버지께로부터 너희에게 보낼 보혜사 곧 아버지께로부터 나오시는 진리의 성령이 오실 때에 그가 나를 증언하실 것이요
27 너희도 처음부터 나와 함께 있었으므로 증언하느니라`,
            textEn: `1 "I am the true vine, and my Father is the gardener.
2 He cuts off every branch in me that bears no fruit, while every branch that does bear fruit he prunes so that it will be even more fruitful.
3 You are already clean because of the word I have spoken to you.
4 Remain in me, as I also remain in you. No branch can bear fruit by itself; it must remain in the vine. Neither can you bear fruit unless you remain in me.
5 "I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit; apart from me you can do nothing.
6 If you do not remain in me, you are like a branch that is thrown away and withers; such branches are picked up, thrown into the fire and burned.
7 If you remain in me and my words remain in you, ask whatever you wish, and it will be done for you.
8 This is to my Father's glory, that you bear much fruit, showing yourselves to be my disciples.
9 "As the Father has loved me, so have I loved you. Now remain in my love.
10 If you keep my commands, you will remain in my love, just as I have kept my Father's commands and remain in his love.
11 I have told you this so that my joy may be in you and that your joy may be complete.
12 My command is this: Love each other as I have loved you.
13 Greater love has no one than this: to lay down one's life for one's friends.
14 You are my friends if you do what I command.
15 I no longer call you servants, because a servant does not know his master's business. Instead, I have called you friends, for everything that I learned from my Father I have made known to you.
16 You did not choose me, but I chose you and appointed you so that you might go and bear fruit—fruit that will last—and so that whatever you ask in my name the Father will give you.
17 This is my command: Love each other.
18 "If the world hates you, keep in mind that it hated me first.
19 If you belonged to the world, it would love you as its own. As it is, you do not belong to the world, but I have chosen you out of the world. That is why the world hates you.
20 Remember what I told you: 'A servant is not greater than his master.' If they persecuted me, they will persecute you also. If they obeyed my teaching, they will obey yours also.
21 They will treat you this way because of my name, for they do not know the one who sent me.
22 If I had not come and spoken to them, they would not be guilty of sin; but now they have no excuse for their sin.
23 Whoever hates me hates my Father as well.
24 If I had not done among them the works no one else did, they would not be guilty of sin. As it is, they have seen, and yet they have hated both me and my Father.
25 But this is to fulfill what is written in their Law: 'They hated me without reason.'
26 "When the Advocate comes, whom I will send to you from the Father—the Spirit of truth who goes out from the Father—he will testify about me.
27 And you also must testify, for you have been with me from the beginning.`,
          },
        ],
      },
    ],
  },
  {
    group: "GBS",
    groupEn: "GBS",
    items: [
      {
        id: "gbs-1",
        label: "1강",
        title: "네 죄 사함을 받았느니라",
        titleEn: "Your Sins Are Forgiven",
        passages: [
          {
            ref: "마가복음 2:1-12",
            refEn: "Mark 2:1-12",
            text: `1 수 일 후에 예수께서 다시 가버나움에 들어가시니 집에 계시다는 소문이 들린지라
2 많은 사람이 모여서 문 앞까지도 들어설 자리가 없게 되었는데 예수께서 그들에게 도를 말씀하시더니
3 사람들이 한 중풍병자를 네 사람에게 메워 가지고 예수께로 올새
4 무리들 때문에 예수께 데려갈 수 없으므로 그 계신 곳의 지붕을 뜯어 구멍을 내고 중풍병자가 누운 상을 달아 내리니
5 예수께서 그들의 믿음을 보시고 중풍병자에게 이르시되 작은 자야 네 죄 사함을 받았느니라 하시니
6 어떤 서기관들이 거기 앉아서 마음에 생각하기를
7 이 사람이 어찌 이렇게 말하는가 신성모독이로다 오직 하나님 한 분 외에는 누가 능히 죄를 사하겠느냐
8 그들이 속으로 이렇게 생각하는 줄을 예수께서 곧 중심에 아시고 이르시되 어찌하여 이것을 마음에 생각하느냐
9 중풍병자에게 네 죄 사함을 받았느니라 하는 말과 일어나 네 상을 가지고 걸어가라 하는 말 중에서 어느 것이 쉽겠느냐
10 그러나 인자가 땅에서 죄를 사하는 권세가 있는 줄을 너희로 알게 하려 하노라 하시고 중풍병자에게 말씀하시되
11 내가 네게 이르노니 일어나 네 상을 가지고 집으로 가라 하시니
12 그가 일어나 곧 상을 가지고 모든 사람 앞에서 나가거늘 그들이 다 놀라 하나님께 영광을 돌리며 이르되 우리가 이런 일을 도무지 보지 못하였다 하더라`,
            textEn: `1 A few days later, when Jesus again entered Capernaum, the people heard that he had come home.
2 They gathered in such large numbers that there was no room left, not even outside the door, and he preached the word to them.
3 Some men came, bringing to him a paralyzed man, carried by four of them.
4 Since they could not get him to Jesus because of the crowd, they made an opening in the roof above Jesus by digging through it and then lowered the mat the man was lying on.
5 When Jesus saw their faith, he said to the paralyzed man, "Son, your sins are forgiven."
6 Now some teachers of the law were sitting there, thinking to themselves,
7 "Why does this fellow talk like that? He's blaspheming! Who can forgive sins but God alone?"
8 Immediately Jesus knew in his spirit that this was what they were thinking in their hearts, and he said to them, "Why are you thinking these things?
9 Which is easier: to say to this paralyzed man, 'Your sins are forgiven,' or to say, 'Get up, take your mat and walk'?
10 But I want you to know that the Son of Man has authority on earth to forgive sins." So he said to the man,
11 "I tell you, get up, take your mat and go home."
12 He got up, took his mat and walked out in full view of them all. This amazed everyone and they praised God, saying, "We have never seen anything like this!"`,
          },
        ],
      },
      {
        id: "gbs-2",
        label: "2강",
        title: "삭개오야 속히 내려오라",
        titleEn: "Zacchaeus, Come Down",
        passages: [
          {
            ref: "누가복음 19:1-10",
            refEn: "Luke 19:1-10",
            text: `1 예수께서 여리고로 들어가 지나가시더라
2 삭개오라 이름하는 자가 있으니 세리장이요 또한 부자라
3 그가 예수께서 어떠한 사람인가 하여 보고자 하되 키가 작고 사람이 많아 할 수 없어
4 앞으로 달려가서 보기 위하여 돌무화과나무에 올라가니 이는 예수께서 그리로 지나가시게 됨이러라
5 예수께서 그 곳에 이르사 쳐다 보시고 이르시되 삭개오야 속히 내려오라 내가 오늘 네 집에 유하여야 하겠다 하시니
6 급히 내려와 즐거워하며 영접하거늘
7 뭇 사람이 보고 수군거려 이르되 저가 죄인의 집에 유하러 들어갔도다 하더라
8 삭개오가 서서 주께 여짜오되 주여 보시옵소서 내 소유의 절반을 가난한 자들에게 주겠사오며 만일 누구의 것을 속여 빼앗은 일이 있으면 네 갑절이나 갚겠나이다
9 예수께서 이르시되 오늘 구원이 이 집에 이르렀으니 이 사람도 아브라함의 자손임이로다
10 인자가 온 것은 잃어버린 자를 찾아 구원하려 함이니라`,
            textEn: `1 Jesus entered Jericho and was passing through.
2 A man was there by the name of Zacchaeus; he was a chief tax collector and was wealthy.
3 He wanted to see who Jesus was, but because he was short he could not see over the crowd.
4 So he ran ahead and climbed a sycamore-fig tree to see him, since Jesus was coming that way.
5 When Jesus reached the spot, he looked up and said to him, "Zacchaeus, come down immediately. I must stay at your house today."
6 So he came down at once and welcomed him gladly.
7 All the people saw this and began to mutter, "He has gone to be the guest of a sinner."
8 But Zacchaeus stood up and said to the Lord, "Look, Lord! Here and now I give half of my possessions to the poor, and if I have cheated anybody out of anything, I will pay back four times the amount."
9 Jesus said to him, "Today salvation has come to this house, because this man, too, is a son of Abraham.
10 For the Son of Man came to seek and to save the lost."`,
          },
        ],
      },
      {
        id: "gbs-3",
        label: "3강",
        title: "청년아 일어나라",
        titleEn: "Young Man, Get Up",
        passages: [
          {
            ref: "누가복음 7:11-17",
            refEn: "Luke 7:11-17",
            text: `11 그 후에 예수께서 나인이란 성으로 가실새 제자와 많은 무리가 동행하더니
12 성문에 가까이 이르실 때에 사람들이 한 죽은 자를 메고 나오니 이는 한 어머니의 독자요 그의 어머니는 과부라 그 성의 많은 사람도 그와 함께 나오거늘
13 주께서 과부를 보시고 불쌍히 여기사 울지 말라 하시고
14 가까이 가서 그 관에 손을 대시니 멘 자들이 서는지라 예수께서 이르시되 청년아 내가 네게 말하노니 일어나라 하시매
15 죽었던 자가 일어나 앉고 말도 하거늘 예수께서 그를 어머니에게 주시니
16 모든 사람이 두려워하며 하나님께 영광을 돌려 이르되 큰 선지자가 우리 가운데 일어나셨다 하고 또 하나님께서 자기 백성을 돌보셨다 하더라
17 예수께 대한 이 소문이 온 유대와 사방에 두루 퍼지니라`,
            textEn: `11 Soon afterward, Jesus went to a town called Nain, and his disciples and a large crowd went along with him.
12 As he approached the town gate, a dead person was being carried out—the only son of his mother, and she was a widow. And a large crowd from the town was with her.
13 When the Lord saw her, his heart went out to her and he said, "Don't cry."
14 Then he went up and touched the bier they were carrying him on, and the bearers stood still. He said, "Young man, I say to you, get up!"
15 The dead man sat up and began to talk, and Jesus gave him back to his mother.
16 They were all filled with awe and praised God. "A great prophet has appeared among us," they said. "God has come to help his people."
17 This news about Jesus spread throughout Judea and the surrounding country.`,
          },
        ],
      },
    ],
  },
  {
    group: "아침 묵상",
    groupEn: "Morning Meditation",
    items: [
      {
        id: "dawn-1",
        label: "1강",
        title: "인격적 만남",
        titleEn: "A Personal Encounter",
        passages: [
          {
            ref: "창세기 28:10-22",
            refEn: "Genesis 28:10-22",
            text: `10 야곱이 브엘세바에서 떠나 하란으로 향하여 가더니
11 한 곳에 이르러는 해가 진지라 거기서 유숙하려고 그 곳의 한 돌을 가져다가 베개로 삼고 거기 누워 자더니
12 꿈에 본즉 사닥다리가 땅 위에 서 있는데 그 꼭대기가 하늘에 닿았고 또 본즉 하나님의 사자들이 그 위에서 오르락내리락 하고
13 또 본즉 여호와께서 그 위에 서서 이르시되 나는 여호와니 너의 조부 아브라함의 하나님이요 이삭의 하나님이라 네가 누워 있는 땅을 내가 너와 네 자손에게 주리니
14 네 자손이 땅의 티끌 같이 되어 네가 서쪽과 동쪽과 북쪽과 남쪽으로 퍼져나갈지며 땅의 모든 족속이 너와 네 자손으로 말미암아 복을 받으리라
15 내가 너와 함께 있어 네가 어디로 가든지 너를 지키며 너를 이끌어 이 땅으로 돌아오게 할지라 내가 네게 허락한 것을 다 이루기까지 너를 떠나지 아니하리라 하신지라
16 야곱이 잠이 깨어 이르되 여호와께서 과연 여기 계시거늘 내가 알지 못하였도다
17 이에 두려워하여 이르되 두렵도다 이 곳이여 이것은 다름 아닌 하나님의 집이요 이는 하늘의 문이로다 하고
18 야곱이 아침에 일찍이 일어나 베개로 삼았던 돌을 가져다가 기둥으로 세우고 그 위에 기름을 붓고
19 그 곳 이름을 벧엘이라 하였더라 이 성의 옛 이름은 루스더라
20 야곱이 서원하여 이르되 하나님이 나와 함께 계셔서 내가 가는 이 길에서 나를 지키시고 먹을 떡과 입을 옷을 주시어
21 내가 평안히 아버지 집으로 돌아가게 하시오면 여호와께서 나의 하나님이 되실 것이요
22 내가 기둥으로 세운 이 돌이 하나님의 집이 될 것이요 하나님께서 내게 주신 모든 것에서 십분의 일을 내가 반드시 하나님께 드리겠나이다 하였더라`,
            textEn: `10 Jacob left Beersheba and set out for Harran.
11 When he reached a certain place, he stopped for the night because the sun had set. Taking one of the stones there, he put it under his head and lay down to sleep.
12 He had a dream in which he saw a stairway resting on the earth, with its top reaching to heaven, and the angels of God were ascending and descending on it.
13 There above it stood the Lord, and he said: "I am the Lord, the God of your father Abraham and the God of Isaac. I will give you and your descendants the land on which you are lying.
14 Your descendants will be like the dust of the earth, and you will spread out to the west and to the east, to the north and to the south. All peoples on earth will be blessed through you and your offspring.
15 I am with you and will watch over you wherever you go, and I will bring you back to this land. I will not leave you until I have done what I have promised you."
16 When Jacob awoke from his sleep, he thought, "Surely the Lord is in this place, and I was not aware of it."
17 He was afraid and said, "How awesome is this place! This is none other than the house of God; this is the gate of heaven."
18 Early the next morning Jacob took the stone he had placed under his head and set it up as a pillar and poured oil on top of it.
19 He called that place Bethel, though the city used to be called Luz.
20 Then Jacob made a vow, saying, "If God will be with me and will watch over me on this journey I am taking and will give me food to eat and clothes to wear
21 so that I return safely to my father's household, then the Lord will be my God
22 and this stone that I have set up as a pillar will be God's house, and of all that you give me I will give you a tenth."`,
          },
        ],
      },
      {
        id: "dawn-2",
        label: "2강",
        title: "존재의 변화",
        titleEn: "Transformation of Being",
        passages: [
          {
            ref: "창세기 32:22-32",
            refEn: "Genesis 32:22-32",
            text: `22 밤에 일어나 두 아내와 두 여종과 열한 아들을 인도하여 얍복 나루를 건널새
23 그들을 인도하여 시내를 건너가게 하며 그의 소유도 건너가게 하고
24 야곱은 홀로 남았더니 어떤 사람이 날이 새도록 야곱과 씨름하다가
25 자기가 야곱을 이기지 못함을 보고 그가 야곱의 허벅지 관절을 치매 야곱의 허벅지 관절이 그 사람과 씨름할 때에 어긋났더라
26 그가 이르되 날이 새려하니 나로 가게 하라 야곱이 이르되 당신이 내게 축복하지 아니하면 가게 하지 아니하겠나이다
27 그 사람이 그에게 이르되 네 이름이 무엇이냐 그가 이르되 야곱이니이다
28 그가 이르되 네 이름을 다시는 야곱이라 부를 것이 아니요 이스라엘이라 부를 것이니 이는 네가 하나님과 및 사람들과 겨루어 이겼음이니라
29 야곱이 청하여 이르되 당신의 이름을 알려주소서 그 사람이 이르되 어찌하여 내 이름을 묻느냐 하고 거기서 야곱에게 축복한지라
30 그러므로 야곱이 그 곳 이름을 브니엘이라 하였으니 그가 이르기를 내가 하나님과 대면하여 보았으나 내 생명이 보전되었다 함이더라
31 그가 브니엘을 지날 때에 해가 돋았고 그의 허벅다리로 말미암아 절었더라
32 그 사람이 야곱의 허벅지 관절에 있는 둔부의 힘줄을 쳤으므로 이스라엘 사람들이 지금까지 허벅지 관절에 있는 둔부의 힘줄을 먹지 아니하더라`,
            textEn: `22 That night Jacob got up and took his two wives, his two female servants and his eleven sons and crossed the ford of the Jabbok.
23 After he had sent them across the stream, he sent over all his possessions.
24 So Jacob was left alone, and a man wrestled with him till daybreak.
25 When the man saw that he could not overpower him, he touched the socket of Jacob's hip so that his hip was wrenched as he wrestled with the man.
26 Then the man said, "Let me go, for it is daybreak." But Jacob replied, "I will not let you go unless you bless me."
27 The man asked him, "What is your name?" "Jacob," he answered.
28 Then the man said, "Your name will no longer be Jacob, but Israel, because you have struggled with God and with humans and have overcome."
29 Jacob said, "Please tell me your name." But he replied, "Why do you ask my name?" Then he blessed him there.
30 So Jacob called the place Peniel, saying, "It is because I saw God face to face, and yet my life was spared."
31 The sun rose above him as he passed Peniel, and he was limping because of his hip.
32 Therefore to this day the Israelites do not eat the tendon attached to the socket of the hip, because the socket of Jacob's hip was touched near the tendon.`,
          },
          {
            ref: "창세기 35:1-15",
            refEn: "Genesis 35:1-15",
            text: `1 하나님이 야곱에게 이르시되 일어나 벧엘로 올라가서 거기 거주하며 네가 네 형 에서의 낯을 피하여 도망하던 때에 네게 나타났던 하나님께 거기서 제단을 쌓으라 하신지라
2 야곱이 이에 자기 집안 사람과 자기와 함께 한 모든 자에게 이르되 너희 중에 있는 이방 신상들을 버리고 자신을 정결하게 하고 너희들의 의복을 바꾸어 입으라
3 우리가 일어나 벧엘로 올라가자 내 환난 날에 내게 응답하시며 내가 가는 길에서 나와 함께 하신 하나님께 내가 거기서 제단을 쌓으려 하노라 하매
4 그들이 자기 손에 있는 모든 이방 신상들과 자기 귀에 있는 귀고리들을 야곱에게 주는지라 야곱이 그것들을 세겜 근처 상수리나무 아래에 묻고
5 그들이 떠났으나 하나님이 그 사면 고을들로 크게 두려워하게 하셨으므로 야곱의 아들들을 추격하는 자가 없었더라
6 야곱과 그와 함께 한 모든 사람이 가나안 땅 루스 곧 벧엘에 이르고
7 그가 거기서 제단을 쌓고 그 곳을 엘벧엘이라 불렀으니 이는 그의 형의 낯을 피할 때에 하나님이 거기서 그에게 나타나셨음이더라
8 리브가의 유모 드보라가 죽으매 그를 벧엘 아래에 있는 상수리나무 밑에 장사하고 그 나무 이름을 알론바굿이라 불렀더라
9 야곱이 밧단아람에서 돌아오매 하나님이 다시 야곱에게 나타나사 그에게 복을 주시고
10 하나님이 그에게 이르시되 네 이름이 야곱이지마는 네 이름을 다시는 야곱이라 부르지 않겠고 이스라엘이 네 이름이 되리라 하시고 그가 그의 이름을 이스라엘이라 부르시고
11 하나님이 그에게 이르시되 나는 전능한 하나님이라 생육하며 번성하라 한 백성과 백성들의 총회가 네게서 나오고 왕들이 네 허리에서 나오리라
12 내가 아브라함과 이삭에게 준 땅을 네게 주고 내가 네 후손에게도 그 땅을 주리라 하시고
13 하나님이 그와 말씀하시던 곳에서 그를 떠나 올라가시는지라
14 야곱이 하나님이 자기와 말씀하시던 곳에 기둥 곧 돌 기둥을 세우고 그 위에 전제물을 붓고 또 그 위에 기름을 붓고
15 하나님이 자기와 말씀하시던 곳의 이름을 벧엘이라 불렀더라`,
            textEn: `1 Then God said to Jacob, "Go up to Bethel and settle there, and build an altar there to God, who appeared to you when you were fleeing from your brother Esau."
2 So Jacob said to his household and to all who were with him, "Get rid of the foreign gods you have with you, and purify yourselves and change your clothes.
3 Then come, let us go up to Bethel, where I will build an altar to God, who answered me in the day of my distress and who has been with me wherever I have gone."
4 So they gave Jacob all the foreign gods they had and the rings in their ears, and Jacob buried them under the oak at Shechem.
5 Then they set out, and the terror of God fell on the towns all around them so that no one pursued them.
6 Jacob and all the people with him came to Luz (that is, Bethel) in the land of Canaan.
7 There he built an altar, and he called the place El Bethel, because it was there that God revealed himself to him when he was fleeing from his brother.
8 Now Deborah, Rebekah's nurse, died and was buried under the oak outside Bethel. So it was named Allon Bakuth.
9 After Jacob returned from Paddan Aram, God appeared to him again and blessed him.
10 God said to him, "Your name is Jacob, but you will no longer be called Jacob; your name will be Israel. " So he named him Israel.
11 And God said to him, "I am God Almighty ; be fruitful and increase in number. A nation and a community of nations will come from you, and kings will be among your descendants.
12 The land I gave to Abraham and Isaac I also give to you, and I will give this land to your descendants after you."
13 Then God went up from him at the place where he had talked with him.
14 Jacob set up a stone pillar at the place where God had talked with him, and he poured out a drink offering on it; he also poured oil on it.
15 Jacob called the place where God had talked with him Bethel.`,
          },
        ],
      },
      {
        id: "dawn-3",
        label: "3강",
        title: "내려놓음 그 너머",
        titleEn: "Beyond Surrender",
        passages: [
          {
            ref: "창세기 43:1-15",
            refEn: "Genesis 43:1-15",
            text: `1 그 땅에 기근이 심하고
2 그들이 애굽에서 가져온 곡식을 다 먹으매 그 아버지가 그들에게 이르되 다시 가서 우리를 위하여 양식을 조금 사오라
3 유다가 아버지에게 말하여 이르되 그 사람이 우리에게 엄히 경고하여 이르되 너희 아우가 너희와 함께 오지 아니하면 너희가 내 얼굴을 보지 못하리라 하였으니
4 아버지께서 우리 아우를 우리와 함께 보내시면 우리가 내려가서 아버지를 위하여 양식을 사려니와
5 아버지께서 만일 그를 보내지 아니하시면 우리는 내려가지 아니하리니 그 사람이 우리에게 말하기를 너희의 아우가 너희와 함께 오지 아니하면 너희가 내 얼굴을 보지 못하리라 하였음이니이다
6 이스라엘이 이르되 너희가 어찌하여 너희에게 또 다른 아우가 있다고 그 사람에게 말하여 나를 괴롭게 하였느냐
7 그들이 이르되 그 사람이 우리와 우리의 친족에 대하여 자세히 질문하여 이르기를 너희 아버지가 아직 살아 계시느냐 너희에게 아우가 있느냐 하기로 그 묻는 말에 따라 그에게 대답한 것이니 그가 너희의 아우를 데리고 내려오라 할 줄을 우리가 어찌 알았으리이까
8 유다가 그의 아버지 이스라엘에게 이르되 저 아이를 나와 함께 보내시면 우리가 곧 가리니 그러면 우리와 아버지와 우리 어린 아이들이 다 살고 죽지 아니하리이다
9 내가 그를 위하여 담보가 되오리니 아버지께서 내 손에서 그를 찾으소서 내가 만일 그를 아버지께 데려다가 아버지 앞에 두지 아니하면 내가 영원히 죄를 지리이다
10 우리가 지체하지 아니하였더라면 벌써 두 번 갔다 왔으리이다
11 그들의 아버지 이스라엘이 그들에게 이르되 그러할진대 이렇게 하라 너희는 이 땅의 아름다운 소산을 그릇에 담아가지고 내려가서 그 사람에게 예물로 드릴지니 곧 유향 조금과 꿀 조금과 향품과 몰약과 유향나무 열매와 감복숭아이니라
12 너희 손에 갑절의 돈을 가지고 너희 자루 아귀에 도로 넣어져 있던 그 돈을 다시 가지고 가라 혹 잘못이 있었을까 두렵도다
13 네 아우도 데리고 떠나 다시 그 사람에게로 가라
14 전능하신 하나님께서 그 사람 앞에서 너희에게 은혜를 베푸사 그 사람으로 너희 다른 형제와 베냐민을 돌려보내게 하시기를 원하노라 내가 자식을 잃게 되면 잃으리로다
15 그 형제들이 예물을 마련하고 갑절의 돈을 자기들의 손에 가지고 베냐민을 데리고 애굽에 내려가서 요셉 앞에 서니라`,
            textEn: `1 Now the famine was still severe in the land.
2 So when they had eaten all the grain they had brought from Egypt, their father said to them, "Go back and buy us a little more food."
3 But Judah said to him, "The man warned us solemnly, 'You will not see my face again unless your brother is with you.'
4 If you will send our brother along with us, we will go down and buy food for you.
5 But if you will not send him, we will not go down, because the man said to us, 'You will not see my face again unless your brother is with you.'"
6 Israel asked, "Why did you bring this trouble on me by telling the man you had another brother?"
7 They replied, "The man questioned us closely about ourselves and our family. 'Is your father still living?' he asked us. 'Do you have another brother?' We simply answered his questions. How were we to know he would say, 'Bring your brother down here'?"
8 Then Judah said to Israel his father, "Send the boy along with me and we will go at once, so that we and you and our children may live and not die.
9 I myself will guarantee his safety; you can hold me personally responsible for him. If I do not bring him back to you and set him here before you, I will bear the blame before you all my life.
10 As it is, if we had not delayed, we could have gone and returned twice."
11 Then their father Israel said to them, "If it must be, then do this: Put some of the best products of the land in your bags and take them down to the man as a gift—a little balm and a little honey, some spices and myrrh, some pistachio nuts and almonds.
12 Take double the amount of silver with you, for you must return the silver that was put back into the mouths of your sacks. Perhaps it was a mistake.
13 Take your brother also and go back to the man at once.
14 And may God Almighty grant you mercy before the man so that he will let your other brother and Benjamin come back with you. As for me, if I am bereaved, I am bereaved."
15 So the men took the gifts and double the amount of silver, and Benjamin also. They hurried down to Egypt and presented themselves to Joseph.`,
          },
          {
            ref: "창세기 46:1-7",
            refEn: "Genesis 46:1-7",
            text: `1 이스라엘이 모든 소유를 이끌고 떠나 브엘세바에 이르러 그의 아버지 이삭의 하나님께 희생제사를 드리니
2 그 밤에 하나님이 이상 중에 이스라엘에게 나타나 이르시되 야곱아 야곱아 하시는지라 야곱이 이르되 내가 여기 있나이다 하매
3 하나님이 이르시되 나는 하나님이라 네 아버지의 하나님이니 애굽으로 내려가기를 두려워하지 말라 내가 거기서 너로 큰 민족을 이루게 하리라
4 내가 너와 함께 애굽으로 내려가겠고 반드시 너를 인도하여 다시 올라올 것이며 요셉이 그의 손으로 네 눈을 감기리라 하셨더라
5 야곱이 브엘세바에서 떠날새 이스라엘의 아들들이 바로가 그를 태우려고 보낸 수레에 자기들의 아버지 야곱과 자기들의 처자들을 태우고
6 그들의 가축과 가나안 땅에서 얻은 재물을 이끌었으며 야곱과 그의 자손들이 다함께 애굽으로 갔더라
7 이와 같이 야곱이 그 아들들과 손자들과 딸들과 손녀들 곧 그의 모든 자손을 데리고 애굽으로 갔더라`,
            textEn: `1 So Israel set out with all that was his, and when he reached Beersheba, he offered sacrifices to the God of his father Isaac.
2 And God spoke to Israel in a vision at night and said, "Jacob! Jacob!" "Here I am," he replied.
3 "I am God, the God of your father," he said. "Do not be afraid to go down to Egypt, for I will make you into a great nation there.
4 I will go down to Egypt with you, and I will surely bring you back again. And Joseph's own hand will close your eyes."
5 Then Jacob left Beersheba, and Israel's sons took their father Jacob and their children and their wives in the carts that Pharaoh had sent to transport him.
6 So Jacob and all his offspring went to Egypt, taking with them their livestock and the possessions they had acquired in Canaan.
7 Jacob brought with him to Egypt his sons and grandsons and his daughters and granddaughters—all his offspring.`,
          },
          {
            ref: "창세기 49:1-33",
            refEn: "Genesis 49:1-33",
            text: `1 야곱이 그 아들들을 불러 이르되 너희는 모이라 너희가 후일에 당할 일을 내가 너희에게 이르리라
2 너희는 모여 들으라 야곱의 아들들아 너희 아버지 이스라엘에게 들을지어다
3 르우벤아 너는 내 장자요 내 능력이요 내 기력의 시작이라 위풍이 월등하고 권능이 탁월하다마는
4 물의 끓음 같았은즉 너는 탁월하지 못하리니 네가 아버지의 침상에 올라 더럽혔음이로다 그가 내 침상에 올랐었도다
5 시므온과 레위는 형제요 그들의 칼은 폭력의 도구로다
6 내 혼아 그들의 모의에 상관하지 말지어다 내 영광아 그들의 집회에 참여하지 말지어다 그들이 그들의 분노대로 사람을 죽이고 그들의 혈기대로 소의 발목 힘줄을 끊었음이로다
7 그 노여움이 혹독하니 저주를 받을 것이요 분기가 맹렬하니 저주를 받을 것이라 내가 그들을 야곱 중에서 나누며 이스라엘 중에서 흩으리로다
8 유다야 너는 네 형제의 찬송이 될지라 네 손이 네 원수의 목을 잡을 것이요 네 아버지의 아들들이 네 앞에 절하리로다
9 유다는 사자 새끼로다 내 아들아 너는 움킨 것을 찢고 올라갔도다 그가 엎드리고 웅크림이 수사자 같고 암사자 같으니 누가 그를 범할 수 있으랴
10 규가 유다를 떠나지 아니하며 통치자의 지팡이가 그 발 사이에서 떠나지 아니하기를 실로가 오시기까지 이르리니 그에게 모든 백성이 복종하리로다
11 그의 나귀를 포도나무에 매며 그의 암나귀 새끼를 아름다운 포도나무에 맬 것이며 또 그 옷을 포도주에 빨며 그의 복장을 포도즙에 빨리로다
12 그의 눈은 포도주로 인하여 붉겠고 그의 이는 우유로 말미암아 희리로다
13 스불론은 해변에 거주하리니 그 곳은 배 매는 해변이라 그의 경계가 시돈까지리로다
14 잇사갈은 양의 우리 사이에 꿇어앉은 건장한 나귀로다
15 그는 쉴 곳을 보고 좋게 여기며 토지를 보고 아름답게 여기고 어깨를 내려 짐을 메고 압제 아래에서 섬기리로다
16 단은 이스라엘의 한 지파 같이 그의 백성을 심판하리로다
17 단은 길섶의 뱀이요 샛길의 독사로다 말굽을 물어서 그 탄 자를 뒤로 떨어지게 하리로다
18 여호와여 나는 주의 구원을 기다리나이다
19 갓은 군대의 추격을 받으나 도리어 그 뒤를 추격하리로다
20 아셀에게서 나는 먹을 것은 기름진 것이라 그가 왕의 수라상을 차리리로다
21 납달리는 놓인 암사슴이라 아름다운 소리를 발하는도다
22 요셉은 무성한 가지 곧 샘 곁의 무성한 가지라 그 가지가 담을 넘었도다
23 활쏘는 자가 그를 학대하며 적개심을 가지고 그를 쏘았으나
24 요셉의 활은 도리어 굳세며 그의 팔은 힘이 있으니 이는 야곱의 전능자 이스라엘의 반석인 목자의 손을 힘입음이라
25 네 아버지의 하나님께로 말미암나니 그가 너를 도우실 것이요 전능자로 말미암나니 그가 네게 복을 주실 것이라 위로 하늘의 복과 아래로 깊은 샘의 복과 젖먹이는 복과 태의 복이리로다
26 네 아버지의 축복이 내 선조의 축복보다 나아서 영원한 산이 한 없음 같이 이 축복이 요셉의 머리로 돌아오며 그 형제 중 뛰어난 자의 정수리로 돌아오리로다
27 베냐민은 물어뜯는 이리라 아침에는 빼앗은 것을 먹고 저녁에는 움킨 것을 나누리로다
28 이들은 이스라엘의 열두 지파라 이와 같이 그들의 아버지가 그들에게 말하고 그들에게 축복하였으니 곧 그들 각 사람의 분량대로 축복하였더라
29 그가 그들에게 명하여 이르되 내가 내 조상들에게로 돌아가리니 나를 헷 사람 에브론의 밭에 있는 굴에 우리 선조와 함께 장사하라
30 이 굴은 가나안 땅 마므레 앞 막벨라 밭에 있는 것이라 아브라함이 헷 사람 에브론에게서 밭과 함께 사서 그의 매장지를 삼았으므로
31 아브라함과 그의 아내 사라가 거기 장사되었고 이삭과 그의 아내 리브가도 거기 장사되었으며 나도 레아를 그 곳에 장사하였노라
32 이 밭과 거기 있는 굴은 헷 사람에게서 산 것이니라
33 야곱이 아들에게 명하기를 마치고 그 발을 침상에 모으고 숨을 거두니 그의 백성에게로 돌아갔더라`,
            textEn: `1 Then Jacob called for his sons and said: "Gather around so I can tell you what will happen to you in days to come.
2 "Assemble and listen, sons of Jacob; listen to your father Israel.
3 "Reuben, you are my firstborn, my might, the first sign of my strength, excelling in honor, excelling in power.
4 Turbulent as the waters, you will no longer excel, for you went up onto your father's bed, onto my couch and defiled it.
5 "Simeon and Levi are brothers— their swords are weapons of violence.
6 Let me not enter their council, let me not join their assembly, for they have killed men in their anger and hamstrung oxen as they pleased.
7 Cursed be their anger, so fierce, and their fury, so cruel! I will scatter them in Jacob and disperse them in Israel.
8 "Judah, your brothers will praise you; your hand will be on the neck of your enemies; your father's sons will bow down to you.
9 You are a lion's cub, Judah; you return from the prey, my son. Like a lion he crouches and lies down, like a lioness—who dares to rouse him?
10 The scepter will not depart from Judah, nor the ruler's staff from between his feet, until he to whom it belongs shall come and the obedience of the nations shall be his.
11 He will tether his donkey to a vine, his colt to the choicest branch; he will wash his garments in wine, his robes in the blood of grapes.
12 His eyes will be darker than wine, his teeth whiter than milk.
13 "Zebulun will live by the seashore and become a haven for ships; his border will extend toward Sidon.
14 "Issachar is a rawboned donkey lying down among the sheep pens.
15 When he sees how good is his resting place and how pleasant is his land, he will bend his shoulder to the burden and submit to forced labor.
16 "Dan will provide justice for his people as one of the tribes of Israel.
17 Dan will be a snake by the roadside, a viper along the path, that bites the horse's heels so that its rider tumbles backward.
18 "I look for your deliverance, Lord.
19 "Gad will be attacked by a band of raiders, but he will attack them at their heels.
20 "Asher's food will be rich; he will provide delicacies fit for a king.
21 "Naphtali is a doe set free that bears beautiful fawns.
22 "Joseph is a fruitful vine, a fruitful vine near a spring, whose branches climb over a wall.
23 With bitterness archers attacked him; they shot at him with hostility.
24 But his bow remained steady, his strong arms stayed limber, because of the hand of the Mighty One of Jacob, because of the Shepherd, the Rock of Israel,
25 because of your father's God, who helps you, because of the Almighty, who blesses you with blessings of the skies above, blessings of the deep springs below, blessings of the breast and womb.
26 Your father's blessings are greater than the blessings of the ancient mountains, than the bounty of the age-old hills. Let all these rest on the head of Joseph, on the brow of the prince among his brothers.
27 "Benjamin is a ravenous wolf; in the morning he devours the prey, in the evening he divides the plunder."
28 All these are the twelve tribes of Israel, and this is what their father said to them when he blessed them, giving each the blessing appropriate to him.
29 Then he gave them these instructions: "I am about to be gathered to my people. Bury me with my fathers in the cave in the field of Ephron the Hittite,
30 the cave in the field of Machpelah, near Mamre in Canaan, which Abraham bought along with the field as a burial place from Ephron the Hittite.
31 There Abraham and his wife Sarah were buried, there Isaac and his wife Rebekah were buried, and there I buried Leah.
32 The field and the cave in it were bought from the Hittites. "
33 When Jacob had finished giving instructions to his sons, he drew his feet up into the bed, breathed his last and was gathered to his people.`,
          },
        ],
      },
    ],
  },
];

// id로 강의 항목을 찾아 소속 group 정보와 함께 반환. 없으면 null.
export function getVerseById(id) {
  for (const g of verseGroups) {
    const item = g.items.find((it) => it.id === id);
    if (item) return { ...item, group: g.group, groupEn: g.groupEn };
  }
  return null;
}
