from flask import Flask, jsonify, request

app = Flask(__name__)

# Cache pour stocker la valeur en décimal
server_cache = {"value": 0}  # Valeur initiale en décimal

# Définir le nombre fixe de bits pour l'affichage
BIT_LENGTH = 8  # Par exemple, 8 bits pour afficher des valeurs comme "00000000"

# Mot de passe requis pour les modifications
PASSWORD = "abcMONEY"  # Remplacez par votre mot de passe sécurisé

@app.route('/', methods=["GET", "POST"])
def main():
    if request.method == "POST":
        # Vérifie la présence du mot de passe dans les headers
        password = request.headers.get("Password")
        if password != PASSWORD:
            return jsonify({"error": "Unauthorized. Invalid or missing password."}), 401

        # Récupérer la valeur binaire dans les données URL-encoded
        binary_value = request.form.get("value")
        if binary_value and len(binary_value) == BIT_LENGTH and all(c in "01" for c in binary_value):
            # Convertir la valeur binaire en décimal pour le stocker
            server_cache["value"] = int(binary_value, 2)
            return jsonify({"value": format(server_cache["value"], f'0{BIT_LENGTH}b')}), 200

        return jsonify({"error": f"Invalid binary value. Must be {BIT_LENGTH} bits of 0s and 1s."}), 400

    elif request.method == "GET":
        # Retourner la valeur en binaire avec un format fixe (par exemple, 8 bits)
        return jsonify({"value": format(server_cache["value"], f'0{BIT_LENGTH}b')}), 200


if __name__ == '__main__':  
    app.run(host='0.0.0.0', port=5000)
