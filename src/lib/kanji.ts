/**
 * 学年別漢字配当表（小学校学習指導要領）の1年生と2年生の漢字。
 * 子どもが読む文言は、この240字だけを漢字で書く。
 */
export const GRADE1_KANJI =
  '一右雨円王音下火花貝学気九休玉金空月犬見五口校左三山子四糸字耳七車手十出女小上森人水正生青夕石赤千川先早草足村大男竹中虫町天田土二日入年白八百文木本名目立力林六'

export const GRADE2_KANJI =
  '引羽雲園遠何科夏家歌画回会海絵外角楽活間丸岩顔汽記帰弓牛魚京強教近兄形計元言原戸古午後語工公広交光考行高黄合谷国黒今才細作算止市矢姉思紙寺自時室社弱首秋週春書少場色食心新親図数西声星晴切雪船線前組走多太体台地池知茶昼長鳥朝直通弟店点電刀冬当東答頭同道読内南肉馬売買麦半番父風分聞米歩母方北毎妹万明鳴毛門夜野友用曜来里理話'

const ALLOWED = new Set([...GRADE1_KANJI, ...GRADE2_KANJI])

const KANJI = /[一-鿿々]/gu

/** 1・2年生で習わない漢字を、重複なしで返す（「々」は前の字をくりかえす記号なので対象外） */
export function disallowedKanji(text: string): string[] {
  const found = (text.match(KANJI) ?? []).filter((c) => c !== '々' && !ALLOWED.has(c))
  return [...new Set(found)]
}
