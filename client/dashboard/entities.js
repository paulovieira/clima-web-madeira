var menuLeftC = new Backbone.Collection([
{
	itemCode: "profile",
	itemTitle: {pt: "Personal data", en: "Personal data"},
	itemIcon: "fa-home"
},

{
	itemCode: "texts",
	//itemTitle: Clima.texts[12].contents,
	itemTitle: {pt: "Texts", en: "Texts"},
	itemIcon: "fa-file-text-o"
},

{
	itemCode: "users",
	itemTitle: {pt: "Users", en: "Users"},
	itemIcon: "fa-user"
},


// {
// 	itemCode: "groups",
// 	itemTitle: {pt: "Groups", en: "Groups"},
// 	itemIcon: "fa-group"
// },

{
	itemCode: "indicators",
	itemTitle: {pt: "Indicators", en: "Indicators"},
	itemIcon: "fa-line-chart"
},

{
	itemCode: "files",
	itemTitle: {pt: "Files", en: "Files"},
	itemIcon: "fa-folder-open-o"
},

{
	itemCode: "maps",
	itemTitle: {pt: "Map tools", en: "Map tools"},
	itemIcon: "fa-wrench"	
}



]);

menuLeftC.each(function(model){
	model.set("lang", Clima.lang);
});






var UserM = Backbone.Model.extend({
	urlRoot: "/api/v1/users",
	defaults: {
		"firstName": "",
		"lastName": "",
		"email": "",
		"createdAt": undefined
	},
	initialize: function(){

	},
	parse: function(resp){
		if(_.isArray(resp)){ resp = resp[0]; }

		resp.createdAt = fecha.format(new Date(resp.createdAt), "YYYY-MM-DD HH:mm:ss");
		resp.createdAtShort = fecha.format(new Date(resp.createdAt), "YYYY-MM-DD");
		resp.userGroups = _.indexBy(resp.userGroups, "name");

		// for this view we won't need these properties
		return resp;
	},

});

var UsersC = Backbone.Collection.extend({
	model: UserM,
	url: "/api/v1/users"
});

var usersC = new UsersC();



var TextM = Backbone.Model.extend({
	urlRoot: "/api/v1/texts",
	defaults: {
		"tags": [],
		"contents": {pt: "", en: ""},
	},

	parse: function(resp){
		if(_.isArray(resp)){ resp = resp[0]; }

		resp.lastUpdated = fecha.format(new Date(resp.lastUpdated), "YYYY-MM-DD HH:mm:ss");
		delete resp.editableId;
		delete resp.pageName;

		return resp;
	}
});

var TextsC = Backbone.Collection.extend({
	model: TextM,
	url: "/api/v1/texts",
});

var textsC = new TextsC();



var FileM = Backbone.Model.extend({
	urlRoot: "/api/v1/files",
	name: "",
	parse: function(resp){
		if(_.isArray(resp)){ resp = resp[0]; }
//debugger;

		resp.uploadedAt = fecha.format(new Date(resp.uploadedAt), "YYYY-MM-DD HH:mm:ss");
		resp.uploadedAtShort = fecha.format(new Date(resp.uploadedAt), "YYYY-MM-DD");

		// delete the properties that might be null
		if(resp.description === null){ delete resp.description; }
		if(resp.properties === null){ delete resp.properties; }

		return resp;
	}
});

var FilesC = Backbone.Collection.extend({
	model: FileM,  
	url: "/api/v1/files",
});

var filesC = new FilesC();






var ShapeM = Backbone.Model.extend({
	urlRoot: "/api/v1/shapes",

	parse: function(resp){
		if(_.isArray(resp)){ resp = resp[0]; }

		resp.createdAt = fecha.format(new Date(resp.createdAt), "YYYY-MM-DD HH:mm:ss");
		resp.createdAtShort = fecha.format(new Date(resp.createdAt), "YYYY-MM-DD");

		// sort the attributesInfo array in ascending order - not needed anymore
		//resp.attributesInfo = _.sortBy(resp.attributesInfo, "column_number");
		
		return resp;
	}
});

var ShapesC = Backbone.Collection.extend({
	model: ShapeM,
	url: "/api/v1/shapes"
});

var shapesC = new ShapesC();





var MapM = Backbone.Model.extend({
	urlRoot: "/api/v1/maps",

	parse: function(resp){
		if(_.isArray(resp)){ resp = resp[0]; }

		resp.createdAt = fecha.format(new Date(resp.createdAt), "YYYY-MM-DD HH:mm:ss");
		
		return resp;
	}
});

var MapsC = Backbone.Collection.extend({
	model: MapM,
	url: "/api/v1/maps"
});

var mapsC = new MapsC();



var MapsMenuC = Backbone.Collection.extend({
	model: Backbone.Model,
	url: "/api/v1/maps-menu"
});

var mapsMenuC = new MapsMenuC();


var SequentialMapsC = Backbone.Collection.extend({
	model: Backbone.Model,
	url: "/api/v1/maps",
	parse: function(data){
		
		// here we want only the sequenctial maps (must have a "sequence" property)
		return _.filter(data, function(mapObj){ return !!mapObj.sequence; });
	}
});

var sequentialMapsC = new SequentialMapsC();


var indicatorsConteudoM = new Backbone.Model({

	ctx: {
		"Agricultura": [
			{
				indicatorId: "ic-1",
				description: "Área de distribuição da bananeira e vinha (ha/ano)"
			},
			{
				indicatorId: "ic-2",
				description: "Nº de notificações de ocorrências de pragas e doenças na agricultura"
			},
			{
				indicatorId: "ic-3",
				description: "Consumo de água para rega (m^3/ano)"
			},
			{
				indicatorId: "ic-4",		
				description: "Taxa de instalação do regadio (%/ano)"
			},
			{
				indicatorId: "ic-5",
				description: "Volume de água superficial e subterrâneo utilizado para o setor agrícola (hm^3/ano)"
			}

		],

		"Florestas": [
			{
				indicatorId: "ic-6",
				description: "Área de floresta plantada (ha)"
			},
			{
				indicatorId: "ic-7",
				description: "Área ardida (ha)"
			},
			{
				indicatorId: "ic-8",
				description: "Áreas florestadas nas zonas de máxima infiltração (ha)"
			},
			{
				indicatorId: "ic-9",
				description: "Área florestal recuperada (ha)"
			},
			{
				indicatorId: "ic-10",
				description: "Área de plantas invasoras (ha)"
			},
			{
				indicatorId: "ic-11",
				description: "Nº de notificações de ocorrências de pragas e doenças na floresta"
			},
		],

		"Biodiversidade": [
			{
				indicatorId: "ic-12",
				description: "Área ardida por habitat (ha)"
			},
			{
				indicatorId: "ic-13",
				description: "Distribuição de espécie indicadora BRIÓFITOS (ex.: Echinodium setigerum) (ha)"
			},
			{
				indicatorId: "ic-14",
				description: "Distribuição de espécie indicadora LÍQUENES (ex.: Sticta canariensis) (ha)"
			},
			{
				indicatorId: "ic-15",
				description: "Abundância específica do pescado"
			},
	
		],

		"Energia": [
			{
				indicatorId: "ic-16",
				description: "Produção de eletricidade de origem renovável (GWh/ano)"
			},
			{
				indicatorId: "ic-17",
				description: "Consumo de energia em edifícios (GWh/ano)"
			},
		],

		"Recursos Hídricos": [
			{
				indicatorId: "ic-18",
				description: "Concentração de cloretos nas Ribeiras do concelho de Santa Cruz e de Boaventura (g/l)"
			},
			{
				indicatorId: "ic-19",
				description: "Caudais das nascentes acima dos 1000 metros (m^3/s)"
			},
			{
				indicatorId: "ic-20",
				description: "Água residual reutilizada (m^3/ano)"
			},
			{
				indicatorId: "ic-21",
				description: "Disponibilidades hídricas subterrâneas anuais (m^3/ano)"
			},
			{
				indicatorId: "ic-22",
				description: "Perdas de água nas redes de distribuição de água potável e rede de rega (m^3/km)"
			},
		],

		"Riscos Hidrogeomorfológicos": [
			{
				indicatorId: "ic-23",
				description: "Nº de vítimas, desalojados, habitações destruídas, infraestruturas rodoviárias destruídas em episódios de aluviões"
			},
			{
				indicatorId: "ic-24",
				description: "Nº e caracterização dos movimentos de massa em vertentes"
			},
			{
				indicatorId: "ic-25",
				description: "Investimento anual em proteção e manutenção costeira (€/ano)"
			},
		],

		"Saúde": [
			{
				indicatorId: "ic-26",
				description: "Nº de pessoas afetadas anualmente com o vírus do Dengue"
			},
			{
				indicatorId: "ic-27",
				description: "Nº de pessoas afetadas anualmente com a doença de Lyme"
			},
			{
				indicatorId: "ic-28",
				description: "Nº de dias por ano que são excedidos os valores limite de ozono e PM10 legislados"
			},
			{
				indicatorId: "ic-29",
				description: "Nº de admissões hospitalares por doenças respiratórias e cardiovasculares"
			},
		],

		"Turismo": [
			{
				indicatorId: "ic-30",
				description: "Área de praia do Porto Santo (ha)"
			},
			{
				indicatorId: "ic-31",
				description: "Nível médio de satisfação para o turismo de natureza"
			},
			{
				indicatorId: "ic-32",
				description: "Investimento anual em manutenção de infraestruturas rodoviárias e marítimas, causadas por desastres de origem meteorológica (€/ano)"
			},
			{
				indicatorId: "ic-33",
				description: "Nº de voos cancelados devido a condições meteorológicas adversas"
			},
			{
				indicatorId: "ic-34",
				description: "Nº de ligações marítimas canceladas devido a condições meteorológicas adversas"
			},
		]

	}

});

var indicatorsConteudoM2 = new Backbone.Model({

	agricultura: [
	{
		indicatorId: "ic-1",
		description: "Área de distribuição da bananeira e vinha (ha/ano)"
	},
	{
		indicatorId: "ic-2",
		description: "Nº de notificações de ocorrências de pragas e doenças na agricultura"
	},
	{
		indicatorId: "ic-3",
		description: "Consumo de água para rega (m^3/ano)"
	},
	{
		indicatorId: "ic-4",		
		description: "Taxa de instalação do regadio (%/ano)"
	},
	{
		indicatorId: "ic-5",
		description: "Volume de água superficial e subterrâneo utilizado para o setor agrícola (hm^3/ano)"
	}

	],

	florestas: [
	{
		indicatorId: "ic-6",
		description: "Área de floresta plantada (ha)"
	},
	{
		indicatorId: "ic-7",
		description: "Área ardida (ha)"
	},
	{
		indicatorId: "ic-8",
		description: "Áreas florestadas nas zonas de máxima infiltração (ha)"
	},
	{
		indicatorId: "ic-9",
		description: "Área florestal recuperada (ha)"
	},
	{
		indicatorId: "ic-10",
		description: "Área de plantas invasoras (ha)"
	},
	{
		indicatorId: "ic-11",
		description: "Nº de notificações de ocorrências de pragas e doenças na floresta"
	},
	],

	biodiversidade: [
	{
		indicatorId: "ic-12",
		description: "Área ardida por habitat (ha)"
	},
	{
		indicatorId: "ic-13",
		description: "Distribuição de espécie indicadora BRIÓFITOS (ex.: Echinodium setigerum) (ha)"
	},
	{
		indicatorId: "ic-14",
		description: "Distribuição de espécie indicadora LÍQUENES (ex.: Sticta canariensis) (ha)"
	},
	{
		indicatorId: "ic-15",
		description: "Abundância específica do pescado"
	},
	
	
	],

	energia: [
	{
		indicatorId: "ic-16",
		description: "Produção de eletricidade de origem renovável (GWh/ano)"
	},
	{
		indicatorId: "ic-17",
		description: "Consumo de energia em edifícios (GWh/ano)"
	},
	
	
	
	
	],

	recursosHidricos: [
	{
		indicatorId: "ic-18",
		description: "Concentração de cloretos nas Ribeiras do concelho de Santa Cruz e de Boaventura (g/l)"
	},
	{
		indicatorId: "ic-19",
		description: "Caudais das nascentes acima dos 1000 metros (m^3/s)"
	},
	{
		indicatorId: "ic-20",
		description: "Água residual reutilizada (m^3/ano)"
	},
	{
		indicatorId: "ic-21",
		description: "Disponibilidades hídricas subterrâneas anuais (m^3/ano)"
	},
	{
		indicatorId: "ic-22",
		description: "Perdas de água nas redes de distribuição de água potável e rede de rega (m^3/km)"
	},
	
	],

	riscosHidrogeomorfologicos: [
	{
		indicatorId: "ic-23",
		description: "Nº de vítimas, desalojados, habitações destruídas, infraestruturas rodoviárias destruídas em episódios de aluviões"
	},
	{
		indicatorId: "ic-24",
		description: "Nº e caracterização dos movimentos de massa em vertentes"
	},
	{
		indicatorId: "ic-25",
		description: "Investimento anual em proteção e manutenção costeira (€/ano)"
	},
		
	],

	saude: [
	{
		indicatorId: "ic-26",
		description: "Nº de pessoas afetadas anualmente com o vírus do Dengue"
	},
	{
		indicatorId: "ic-27",
		description: "Nº de pessoas afetadas anualmente com a doença de Lyme"
	},
	{
		indicatorId: "ic-28",
		description: "Nº de dias por ano que são excedidos os valores limite de ozono e PM10 legislados"
	},
	{
		indicatorId: "ic-29",
		description: "Nº de admissões hospitalares por doenças respiratórias e cardiovasculares"
	},
		
	],

	turismo: [
	{
		indicatorId: "ic-30",
		description: "Área de praia do Porto Santo (ha)"
	},
	{
		indicatorId: "ic-31",
		description: "Nível médio de satisfação para o turismo de natureza"
	},
	{
		indicatorId: "ic-32",
		description: "Investimento anual em manutenção de infraestruturas rodoviárias e marítimas, causadas por desastres de origem meteorológica (€/ano)"
	},
	{
		indicatorId: "ic-33",
		description: "Nº de voos cancelados devido a condições meteorológicas adversas"
	},
	{
		indicatorId: "ic-34",
		description: "Nº de ligações marítimas canceladas devido a condições meteorológicas adversas"
	},
	
	]
})

var indicatorsProcessoM = new Backbone.Model({
	faseUm: [
		{
			indicatorId:"1a",
			description: "Existe um organismo da administração regional responsável pela elaboração de políticas de adaptação e existem mecanismos de coordenação vertical e horizontal com outros órgãos governamentais."
		},
		{
			indicatorId:"1b",
			description: "Existe um organismo da administração regional responsável pela elaboração de políticas de adaptação e existem mecanismos de coordenação vertical e horizontal com outros órgãos governamentais."
		},
		{
		indicatorId: "1c",
		description: "Estão planeadas ações de cooperação com outras regiões ultraperiféricas da Macaronésia, para enfrentar os desafios comuns das alterações climáticas."
		},
		{
		indicatorId: "1d",
		description: "Existem sistemas de observação para monitorizar os impactes das alterações climáticas e de eventos extremos climáticos."
		},
		{
		indicatorId: "1e",
		description: "São utilizados cenários e projeções para avaliar os impactes económicos, sociais e ambientais das alterações climáticas."
		},
		{
		indicatorId: "1f",
		description: "Os agentes estão envolvidos na definição de prioridades de investigação e existem interfaces entre ciência e política, tais como workshops, para facilitar o diálogo entre investigadores e decisores políticos."
		},
		{
		indicatorId: "1g",
		description: "As lacunas de conhecimento identificadas são usadas para priorizar o financiamento público da investigação sobre impactes, vulnerabilidades e adaptação às alterações climáticas."
		},
		{
		indicatorId: "1h",
		description: "Os dados e informações relevantes sobre adaptação estão disponíveis para todos os agentes, por exemplo, através de um website dedicado."
		},
		{
		indicatorId: "1i",
		description: "Ocorrem atividades de capacitação e sensibilização, sendo disponibilizados e disseminados materiais de educação e de formação sobre adaptação às alterações climáticas."
		},
	],
	faseDois: [
		{
		indicatorId: "2a",
		description: "Para os setores prioritários, é considerada uma gama de opções de adaptação consistente, com os resultados de estudos de avaliação das vulnerabilidades setoriais às alterações climáticas e com medidas e boas práticas de adaptação."
		},
		{
		indicatorId: "2b",
		description: "Está disponível um orçamento específico para o financiamento de medidas de adaptação e para aumentar a resiliência ao clima nos setores vulneráveis."
		},
		{
		indicatorId: "2c",
		description: "Estão a ser mapeadas as medidas de adaptação autónomas."
		}
	],
	faseTres: [
		{
		indicatorId: "3a",
		description: "As atuais estratégias de gestão e prevenção de riscos consideram os extremos climáticos atuais e projetados."
		},
		{
		indicatorId: "3b",
		description: "As atuais políticas de planeamento e gestão do uso do solo têm em conta os impactes das alterações climáticas."
		},
		{
		indicatorId: "3c",
		description: "A adaptação já está integrada em instrumentos financeiros e de gestão de risco ou instrumentos políticos alternativos, para incentivar investimentos na prevenção de riscos."
		},
		{
		indicatorId: "3d",
		description: "Estão definidos planos de ação ou documentos de política setorial, para que a adaptação seja efetivamente implementada."
		},
		{
		indicatorId: "3e",
		description: "Existem mecanismos de cooperação para fomentar e apoiar a adaptação a diferentes escalas relevantes, por exemplo, municipal e local."
		},
		{
		indicatorId: "3f",
		description: "Existem processos para o envolvimento dos agentes na implementação das políticas, medidas e projetos de adaptação."
		},
		{
		indicatorId: "3g",
		description: "A integração da adaptação às alterações climáticas nas políticas setoriais é monitorizada, através de indicadores de conteúdo relevantes."
		},
		{
		indicatorId: "3h",
		description: "A informação sobre ações de adaptação é recolhida e divulgada, incluindo, por exemplo, os gastos relacionados com a adaptação."
		},
		{
		indicatorId: "3i",
		description: "Existe cooperação entre os vários organismos da administração regional ou local para recolher dados e informações sobre a adaptação nos diferentes níveis."
		},
		{
		indicatorId: "3j",
		description: "Está prevista a revisão periódica da Estratégia CLIMA-Madeira."
		},
		{
		indicatorId: "3k",
		description: "Os agentes estão envolvidos na avaliação e revisão da política regional de adaptação às alterações climáticas."
		}
	]
});
