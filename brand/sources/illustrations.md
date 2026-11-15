# Prompts des illustrations

Modèle : `flux3_image_klein_sd_int8_convrot` + `qwen3vl_4b_int8_convrot` (CLIPLoader type flux3) + `flux2-vae`, `EmptyFlux2LatentImage`, KSampler 16 étapes, cfg 1, euler / simple. Négatif : ConditioningZeroOut. Prompt = sujet + style commun.

## Style commun

```
Soft editorial photograph for an elegant small beauty institute. Muted palette of mauve, lavender, dusty violet and warm ivory, gentle diffused light, shallow depth of field, calm and serene, minimal composition, fine grain, no text, no logo, no watermark.
```

## Sujets

```python
'cils': "Extreme close-up of a woman's closed eye with long, naturally curled, glossy eyelashes after a lash lift, "
         "relaxed face, smooth skin, soft lavender light falling from the side, lilac silk fabric blurred in the background.",
 'massage': "Still life for a Californian massage: an amber glass bottle of warm massage oil, a small dish of oil, smooth "
            "stones, a folded lavender cotton towel, a sprig of dried lavender, a lit candle on a pale wooden surface, "
            "mauve fabric draped behind.",
 'reiki': "Two hands of a therapist hovering gently a few centimeters above the shoulders of a person lying relaxed under "
          "a soft lilac blanket, faces out of frame, delicate glow of light between the hands, amethyst crystal and candle "
          "nearby, peaceful atmosphere.",
 'drainage': "A therapist's hands performing a gentle lymphatic drainage massage on a woman's lower leg and calf, legs "
             "resting on a white treatment table covered with a lavender towel, faces out of frame, soft daylight.",
 'texture': "Abstract background texture: soft swirling smoke and velvet in deep violet night, aubergine and dusty mauve, "
            "subtle lavender highlights, smooth gradients, no hard edges, no objects, dreamy and elegant, fills the frame.",
```

Pour le massage, « an amber glass bottle » a été remplacé par « a plain unlabeled amber glass dropper bottle of warm massage oil with no label and no writing » (sinon le modèle écrit une fausse étiquette).

| Image | Sujet | Graine |
| --- | --- | --- |
| `rehaussement-cils.jpg` | cils | 101 |
| `massage-californien.jpg` | massage (sans étiquette) | 303 |
| `reiki.jpg` | reiki | 202 |
| `drainage-lymphatique.jpg` | drainage | 101 |
| `textures/ciel.jpg` | texture 1920×1088, puis assombrie (multiplication par #9682af, fondu 25 % vers #1f1830) | 101 |
