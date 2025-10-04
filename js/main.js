document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav a');
    const contentDiv = document.getElementById('content');

    const sections = {
        'variantes-buenas': {
            title: 'Variantes Recomendadas para Subir de Nivel',
            endpoint: '/api/variantes/buenas'
        },
        'variantes-malas': {
            title: 'Variantes No Recomendadas para Subir de Nivel',
            endpoint: '/api/variantes/malas'
        },
        'combos': {
            title: 'Combos de Personajes',
            endpoint: '/api/combos'
        },
        'efectos-positivos': {
            title: 'Efectos Positivos (Buffs)',
            endpoint: '/api/efectos/positivos'
        },
        'efectos-negativos': {
            title: 'Efectos Negativos (Debuffs)',
            endpoint: '/api/efectos/negativos'
        }
    };

    const loadContent = async (sectionKey) => {
        const section = sections[sectionKey];
        if (!section) return;

        try {
            const response = await fetch(section.endpoint);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            renderContent(sectionKey, section.title, data);
        } catch (error) {
            contentDiv.innerHTML = `<p>Error al cargar el contenido: ${error.message}</p>`;
        }
    };

    const renderContent = (sectionKey, title, data) => {
        let html = `<section class="section"><h2>${title}</h2>`;

        if (sectionKey.includes('variantes')) {
            // Agregar el formulario de variantes
            const formTemplate = document.getElementById('variante-form-template');
            if (formTemplate) {
                html += formTemplate.innerHTML;
            }
            
            html += '<h3>Variantes Existentes</h3>';
            html += '<div class="grid-container">';
            data.forEach(item => {
                html += `
                    <div class="grid-item">
                        <img src="${item.imagenUrl}" alt="${item.nombre}">
                        <p><strong>${item.nombre}</strong></p>
                        <p>${item.habilidad}</p>
                    </div>
                `;
            });
            html += '</div>';
        } else if (sectionKey === 'combos') {
            const formTemplate = document.getElementById('combo-form-template');
            if (formTemplate) {
                html += formTemplate.innerHTML;
            }
            html += '<h3>Todos los Combos</h3>';
            html += '<div class="video-container">';
            data.forEach(item => {
                html += `
                    <div class="video-item">
                        <h3>${item.personaje}</h3>
                        <p>${item.descripcion}</p>
                        <video controls width="320">
                            <source src="${item.videoUrl}" type="video/mp4">
                            Tu navegador no soporta el tag de video.
                        </video>
                        <p><strong>No recomendable contra:</strong> ${item.noRecomendable}</p>
                    </div>
                `;
            });
            html += '</div>';
        } else if (sectionKey.includes('efectos')) {
            // Agregar el formulario de efectos
            const formTemplate = document.getElementById('efecto-form-template');
            if (formTemplate) {
                html += formTemplate.innerHTML;
            }

            html += '<h3>Efectos Existentes</h3>';
            html += '<div class="effect-container">';
            data.forEach(item => {
                html += `
                    <div class="effect-item">
                        <img src="${item.imagenUrl}" alt="${item.nombre}">
                        <div>
                            <p><strong>${item.nombre}</strong></p>
                            <p>${item.descripcion}</p>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
        }

        html += '</section>';
        contentDiv.innerHTML = html;

        if (sectionKey === 'combos') {
            const addComboForm = document.getElementById('add-combo-form');
            if (addComboForm) {
                addComboForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const formData = new FormData(addComboForm);

                    try {
                        const response = await fetch('/api/combos', {
                            method: 'POST',
                            body: formData
                        });

                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                        }

                        addComboForm.reset();
                        loadContent('combos'); // Recargar la sección de combos
                    } catch (error) {
                        console.error('Error al añadir combo:', error);
                        alert(`Error: ${error.message}`);
                    }
                });
            }
        } else if (sectionKey.includes('variantes')) {
            const addVarianteForm = document.getElementById('add-variante-form');
            if (addVarianteForm) {
                addVarianteForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const formData = new FormData(addVarianteForm);

                    try {
                        const response = await fetch('/api/variantes', {
                            method: 'POST',
                            body: formData
                        });

                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                        }

                        addVarianteForm.reset();
                        // Recargar la sección correspondiente
                        const esVarianteBuena = formData.get('esBuena') === 'true';
                        loadContent(esVarianteBuena ? 'variantes-buenas' : 'variantes-malas');
                    } catch (error) {
                        console.error('Error al añadir variante:', error);
                        alert(`Error: ${error.message}`);
                    }
                });
            }
        } else if (sectionKey.includes('efectos')) {
            const addEfectoForm = document.getElementById('add-efecto-form');
            if (addEfectoForm) {
                addEfectoForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const formData = new FormData(addEfectoForm);

                    try {
                        const response = await fetch('/api/efectos', {
                            method: 'POST',
                            body: formData
                        });

                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                        }

                        addEfectoForm.reset();
                        // Recargar la sección correspondiente
                        const esPositivo = formData.get('esPositivo') === 'true';
                        loadContent(esPositivo ? 'efectos-positivos' : 'efectos-negativos');
                    } catch (error) {
                        console.error('Error al añadir efecto:', error);
                        alert(`Error: ${error.message}`);
                    }
                });
            }
        }
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionKey = e.target.dataset.section;
            loadContent(sectionKey);
        });
    });

    // Cargar la primera sección por defecto
    loadContent('variantes-buenas');
});
