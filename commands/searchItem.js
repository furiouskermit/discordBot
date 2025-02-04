const axios = require('axios');
const cheerio = require('cheerio');
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("검색")
    .setDescription("아이템 검색")
    .addStringOption((option) =>
        option
            .setName("아이템")
            .setDescription("아이템 이름")
            .setRequired(true)
    ),
    run: async ({interaction}) => {
        await interaction.deferReply();

        const ffxivItem = interaction.options.get("아이템").value;

        try {
            const html = await axios.get(`https://ff14.inven.co.kr/dataninfo/item/?itemname=${ffxivItem}&datagroup=search`);

            let $ = cheerio.load(html.data);
            const result = $("table.board_list tbody tr")
            let itemHref = "";
            for(const list of result) {
                const listNode = list.children[1].childNodes[0];
                const title = listNode.children[0].data;
                if(ffxivItem === title) {
                    itemHref = listNode.attribs.href;
                    break;
                }
            }

            let detailTitle = "";
            let detailDesc = "";
            let detailThumb = "";
            let detailObtainInfo = "획득 정보가 없습니다";
            if(itemHref !== "") {
                const detailHtml = await axios.get(`https://ff14.inven.co.kr/dataninfo/item/${itemHref}`);
                let $ = cheerio.load(detailHtml.data);

                // title & description
                detailTitle = $(".itemname dd span").text()
                detailDesc = $(".itemdesc dd").text()

                // thumbnail
                const imgNode = $(".itemicon img").first();
                detailThumb = imgNode.length ? imgNode.attr("src") : "";

                // obtain info
                const obtainInfoList = $(".obtainInfo li:not(.subFirst, .fixed)");
                if(obtainInfoList.length > 0) {
                    detailObtainInfo = obtainInfoList.map((i, info) => {
                        let exchange = "";
                        if(info.children[0]?.attribs.src === "//static.inven.co.kr/image_2011/ff14/fonticon/fonticon_item_obtain3.png") {
                            exchange = "[교환]"
                        }
                        return `${exchange} ${info.children[1]?.data}` || "";
                    }).get().join("\n");
                }
            }

            const embed = new EmbedBuilder()
                .setTitle(ffxivItem)
                .setDescription(detailDesc || "설명 없음")
                .setThumbnail(detailThumb)
            if(itemHref !== ""){
                embed
                    .setURL(`https://ff14.inven.co.kr/dataninfo/item/${itemHref}`)
                    .setFooter({text: `https://ff14.inven.co.kr/dataninfo/item/${itemHref}`})
                    .addFields(
                        {
                            name: "획득 정보",
                            value: detailObtainInfo,
                            inline: false,
                        }
                    )
            }

		    await interaction.editReply({ embeds: [embed] });
        } catch(error) {
            console.log(error);
            await interaction.followUp(`에러 발생: ${error.message}`);
        }
        
    },
}