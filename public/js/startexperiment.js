function end_sakeExpriment() {
    const data = {
        "actions": actions,
        "timestamps": actions_t
    }
    fetch(sak_page_url, {
        method: 'POST', // or 'PUT'
        redirect: 'follow',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url;
            }
        }
        )
        .catch((error) => {
            console.error('Error:', error);
        })
}
