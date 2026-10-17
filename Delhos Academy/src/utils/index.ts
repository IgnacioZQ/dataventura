export function createPageUrl(pageName: string) {
    return '/' + pageName.replace(/ /g, '-');
}

/** Dirección completa de una página (con /academy/ delante), para navegar recargando con window.location. */
export function pageHref(pageName: string) {
    return import.meta.env.BASE_URL.replace(/\/$/, '') + createPageUrl(pageName);
}
