
async function main () {
    try {
        const currentAccessToken = await getAccessToken();
        const deals = await fetchDeals(currentAccessToken);
        console.log("Список сделок:", deals);
    
    } catch (error) {
    console.log("Произошла ошибка:", error);
}
};

main();

async function getAccessToken () {
    const myAccessToken = await fetch('https://prostolera27.amocrm.ru/oauth2/access_token' , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "client_id": "fb362f1a-7691-4e7f-92ab-549c87581dd8",
            "client_secret": "pCzeggQBGUeP1VRByGpzKQYe0sxMmsOwdYkWQ8CjgTIQTUcBUI8VyWsxiXwTccIO",
            "grant_type": "authorization_code",
            "code": "def50200d291337daffb99b70739c8f4a7ea5390c9e2bfcd46da10b3639a9e8dc09294f1b17150ccaa09da0a655d47e40dcd4d3aa1c0cd9639bb7226983ec872653ad1292ad71a04af5b26b7bc64aa059355cf30fa6fa349de6116c1f35db93c5eba2ca9c9b64a1faa0d9dcf21df41d0da10fecf1dd7fa243146ccd1311e376b8e8f4d219c1a366628ab7ed148047bf05d0fbe30d493598410c22f3734c7cbb233ff47390698c993816cca82e39169c6cca0357f992d5482465fbb36e9a8225c9f54b5427d7b502b86e49376bef2d0e1ab110cf13503918395de44f8d313dd329ec9365ed097c5c2ec9495a9bcc634c102674ee0a4735b8bd29804ea8ffc599af6d12e065e1c7b3afb5436af2929c3143725dff7f95cc3e6d1144300b2d379e97e04b10d7093bca9e6792e5b5f9c658a50e52b8ad9a1bc77fc52784f7055b7a4b9440a6b78ad409b489017801604d0be4fe3672a4c0fecaea5ec4f939965579d360a7c12b3ab9384464bbfac2d84c7af14216ceb51d7560744cd54c0a5e4bfbf84e961e35811114720b8c25fef9df3821ad1f9856a9eb0877d8db5b1d8de7b9e9ba9147653138acb1cae9c8ee5fdabb2bf4341a743ea3931e44b1b784fdfd41db0cc26ba72bd7a39a23633394993f908e2a2256ba28b6088474e82f83d09e2bd2c6ead71517d",
            "redirect_uri": "https://localhost.com"
        }),
        });  
        
        const currentAccessToken = await myAccessToken.json(); 
        return currentAccessToken.access_token;
};

async function fetchDeals(currentAccessToken) {
        const response = await fetch('https://prostolera27.amocrm.ru/api/v4/leads', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + currentAccessToken,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            console.log(error);
            return null;
        }
        const deals = await response.json();
        console.log(deals); 
        return deals;
};



