let $body = $('body');
let $container = $body.find('.js-content-area');

const escButton = `
    <div id="escButtonContainer" class="aboutButton buttonHover no-select-text cursor-pointer js-close-about-area">
        ESC
    </div>
`;

const arrowsContainer = `
    <div id="arrowsButtonsContainer">
        <div id="leftButtonArrow" class="aboutButton buttonHover no-select-text cursor-pointer js-about-left-arrow">&#9665;</div>
        <div id="rightButtonArrow" class="aboutButton buttonHover no-select-text cursor-pointer js-about-right-arrow">&#9655;</div>
    </div>
`;

const projsContainer = `<div class="projsContainer js-projs-container"></div>`;

const companyWrapper = `
    <div class="companyHeader">
        <a class="companyHeaderLogoImageContainer js-company-logo-image" href="" target="_blank"></a>
        <span class="text-big-header text-color js-company-logo-name"></span>
    </div>
    <div class="companyProjects js-company-projects"></div>
`;

const projectWrapper = `
    <div class="projectDetailsContainer">
        <div class="projectDetailsHeader text-small-header text-color no-select-text js-project-name"></div>
        <div class="projectDetailsContent">
            <div class="projectDetailsDescription"></div>
            <div class="projectDetailsImage"></div>
        </div>
    </div>
`;

function getProgrammerQuote() {
    let quote;
    let $quoteContainer = $body.find('.js-quote-container');

    $.ajax({
        url: 'http://cors-proxy.htmldriven.com/?url=http://thoughtsoncoding.com/api/1.0/random.json',
        error: function () {
            quote = '"Insert cheeky quote here."';
            $quoteContainer.html(quote);
        },
        success: function (data) {
            quote = '"' + JSON.parse(data.body).quote + '"';
            $quoteContainer.html(quote);
        }
    });
}

function addProjsContainer() {
    let $container = $body.find('.js-content-section');

    return new Promise((resolve, reject) => {
        $container.html(projsContainer);
        resolve();
    });
}

function cleanSection(section) {
    let $container = $body.find('.' + section);

    return new Promise((resolve, reject) => {
        $container.empty();
        resolve();
    });
}

function addWrapper(wrapper) {
    return new Promise((resolve, reject) => {
        let $container = $body.find('.js-content-section');
        let html = ``;

        switch(wrapper) {
            case 'company':
                html = companyWrapper;
                break;
            case 'project':
                html = projectWrapper;
                break;
            default:
                html = ``;
        }

        $container.html(html);
        resolve();
    });
}

module.exports = {
    addAboutButton: function (buttonContent = '', classPositioning = '') {
        $container.append(escButton);
    },
    addArrowsContainer: function (buttonContent = '', classPositioning = '') {
        $container.append(arrowsContainer);
    },
    loadContactsContent: function () {
        return new Promise((resolve, reject) => {
            const html = `
                <div id="contactContainer">
                    <ul id="contactsListContainer">
                        <li class="contactsListItem">
                            For more information you can contact me using:
                        </li>
                        <li class="contactsListItem">
                            <a href="mailto:miguel.rib.20@gmail.com" class="contactsListItem--myEmail" target="_top">My Email</a>
                        </li>
                        <li class="contactsListItem">
                            <a href="https://www.linkedin.com/in/miguel-ribeiro-7bb32a110/" target="_blank">
                                <i class="Icon Icon--linkedin"></i>
                            </a>
                        </li>
                        <li class="contactsListItem">
                            <a href="https://github.com/Comum/" target="_blank">
                                <i class="Icon Icon--github"></i>
                            </a>
                        </li>
                        <li class="contactsListItem">
                            <p class="text-italic m-lr-12 js-quote-container"></p>
                        </li>
                    </ul>
                </div>
            `;

            $body.find('.js-content-section').html(html);
            resolve();
        })
        .then(() => {
            getProgrammerQuote();
        });
    },
    loadProjsContent: function () {
        let $container = $body.find('.js-content-section');

        addProjsContainer()
        .then(() => {
            $.getJSON('../json/projects.json', function (data) {
                let $projsContainer = $container.find('.js-projs-container');
                let html = ``;
                let companyWrapper = ``;
                let companyID;

                $.each(data, function( key, val ) {
                    companyID = $(this)[0].companyID;

                    if ($(this)[0].companyID === 'comp_personal') {
                        companyWrapper = `
                            <div class="companyLogo companyOnlyText cursor-pointer no-select-text js-company-logo"
                                 data-company-id="${companyID}">
                                <span class="text-center">Personal Projects</span>
                            </div>
                        `;
                    } else {
                        companyWrapper = `
                            <div class="companyLogo companyLogoImage companyLogo--${companyID} cursor-pointer no-select-text js-company-logo"
                                 data-company-id="${companyID}">
                            </div>
                        `;
                    }

                    html = html + companyWrapper;
                });

                $projsContainer.html(html);
            });
        });
    },
    loadCompanyContent: function(companyID) {
        let companyProjects;

        cleanSection('js-content-section')
        .then(() => {
            addWrapper('company');
        })
        .then(() => {
            $.getJSON('json/projects.json', function(data) {
                let $container = $body.find('.js-company-projects');
                let $companyLogoContainer = $body.find('.js-company-logo-image');
                let $companyNameContainer = $body.find('.js-company-logo-name');
                let html = ``;
                let projectHtml;
                let companyNameClass = 'companyNameImage--';
                let companySite;

                $.each(data, function( key, val ) {
                    if (companyID === this.companyID) {

                        if (companyID === 'comp_personal') {
                            companyNameClass = 'display-none';
                        } else {
                            companyNameClass = companyNameClass + this.companyName.split(' ').join('_');
                        }

                        companySite = this.companySite;
                        $companyLogoContainer
                            .addClass(companyNameClass)
                            .attr('href', companySite);
                        $companyNameContainer.text(this.companyName);

                        this.projects.forEach(project => {
                            let projectName = project.projectName;
                            let projectImage;
                            let projectPlaceHolder = '';
                            let projectID = project.projectID;

                            if (project.projectImages.length) {
                                projectImage = 'projectImage--' + project.projectImages[0].split('.')[0];
                            } else {
                                projectImage = 'projectWithNoImage';
                                projectPlaceHolder = 'Image not available';
                            }

                            projectHtml = `
                                <div class="companyProjectBlockArea text-color js-company-project-block-area"
                                     data-project-id="${projectID}">
                                    <div class="companyProjectImage ${projectImage}">${projectPlaceHolder}</div>
                                    <div class="companyProjectName">${projectName}</div>
                                </div>
                            `;

                            html = html + projectHtml;
                        });
                        /*infoProject = this.projects.
                                    filter(function(proj) {
                                        if (proj.projectID == projID) {
                                        return proj;
                                        }
                                    });
                        loadProjectTemplate(infoProject); */
                    }
                });
                $container.html(html);
            });
        });
    },
    loadProjContent: function() {
        console.log('working');

        cleanSection('js-content-section')
        .then(() => {
            addWrapper('project'); 
        });
    }
}

/*
 * Template example
 * const beer = {
    name: 'Belgian Wit',
    brewery: `Steam Whistle Brewery`,
    keywords: ['pale', 'cloudy', 'spiced', 'crisp']
};

function renderKeywords(keywords) {
    return `
    <ul>
        ${keywords.map(keyword => `<li>${keyword}</li>`)}
    </ul>
    `;
}

const markup = `
<div class="beer">
    <h2>${beer.name}</h2>
    <p class="brewery">${beer.brewery}</p>
    ${renderKeywords(beer.keywords).join('')}
</div>
`;

document.body.innerHTML = markup;
 *
 */