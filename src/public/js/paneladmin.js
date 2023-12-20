function deleteUser(userId) {
    const url = `/api/users/${userId}`;
    const options = { method: 'DELETE' };

    fetch(url, options)
        .then(response => response.json())
        .then(data => {
            data
            location.reload(true);
        })
        .catch(error => {
            console.error('Error al eliminar usuario:', error);
        });
}

function changerole(uid) {
    const url = `/api/auth/changerole/${uid}`;
    const options = { method: 'POST' };

    fetch(url, options)
        .then(response => response.json())
        .then(data => {
            console.log('Rol cambiado exitosamente:', data);
            location.reload(true);
        })
        .catch(error => {
            console.error('Error al cambiar el rol del usuario:', error);
        });
}

