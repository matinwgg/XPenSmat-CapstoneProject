"""
TensorFlow model using TensorFlow Privacy (DP-SGD) for private training.

This file is optional and depends on tensorflow and tensorflow-privacy being installed.
If they are not, importing functions here will raise an informative error.
"""

try:
    import tensorflow as tf
    from tensorflow import keras
    from tensorflow.keras import layers
    from tensorflow_privacy.privacy.optimizers.dp_optimizer_keras import DPKerasAdamOptimizer
    TENSORFLOW_OK = True
except Exception as e:
    TENSORFLOW_OK = False
    _TF_IMPORT_ERROR = e

def ensure_tf():
    if not TENSORFLOW_OK:
        raise RuntimeError("tensorflow and/or tensorflow-privacy not installed. Install via requirements or pip install tensorflow tensorflow-privacy") from _TF_IMPORT_ERROR

def build_dp_model(input_dim: int):
    ensure_tf()
    model = keras.Sequential([
        layers.Input(shape=(input_dim,)),
        layers.Dense(128, activation="relu"),
        layers.Dense(64, activation="relu"),
        layers.Dense(1, activation="linear")
    ])
    return model

def train_dp_model(model, X_train, y_train, X_val=None, y_val=None,
                   batch_size=256, epochs=20,
                   l2_norm_clip=1.0, noise_multiplier=1.1, learning_rate=1e-3):
    ensure_tf()
    optimizer = DPKerasAdamOptimizer(
        l2_norm_clip=l2_norm_clip,
        noise_multiplier=noise_multiplier,
        num_microbatches=None,
        learning_rate=learning_rate
    )
    model.compile(optimizer=optimizer, loss="mse", metrics=["mae"])
    history = model.fit(X_train, y_train, validation_data=(X_val, y_val) if X_val is not None else None,
                        batch_size=batch_size, epochs=epochs)
    return model, history
