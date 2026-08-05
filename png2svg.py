#!/usr/bin/env python3
"""
png2svg.py — High-Detail PNG to SVG Vectorizer
Uses visioncortex VTracer with tuned parameters for crisp, detailed output.

Usage:
    python3 png2svg.py input.png output.svg
    python3 png2svg.py input.png output.svg --preset poster
    python3 png2svg.py input.png output.svg --mode spline --speckle 2 --precision 8
"""

import sys
import argparse

try:
    import vtracer
except ImportError:
    print("ERROR: 'vtracer' not installed.")
    print("Install with:  pip install vtracer")
    sys.exit(1)


def convert_high_detail(input_png, output_svg, **kwargs):
    """
    Convert PNG to SVG with high-detail parameters.

    Tuning philosophy:
    - filter_speckle: 2    → Keep tiny details (default 4 drops small elements)
    - color_precision: 8   → More accurate color quantization
    - layer_difference: 4  → Finer color layering
    - mode: 'spline'       → Smooth Bézier curves instead of jagged polygons
    - corner_threshold: 60 → Detect more corners for sharp shapes
    - length_threshold: 5  → Preserve short edges
    - max_iterations: 10    → More optimization passes
    - splice_threshold: 45 → Tighter spline fitting
    """
    vtracer.convert_image_to_svg_py(
        input_png,
        output_svg,
        # --- Mode ---
        mode=kwargs.get("mode", "spline"),          # 'spline' = smooth curves, 'polygon' = sharp edges

        # --- Pre-processing ---
        filter_speckle=kwargs.get("filter_speckle", 2),    # px; remove speckles smaller than N px (default 4)
        color_precision=kwargs.get("color_precision", 8),  # bits; higher = more colors kept (default 6)
        layer_difference=kwargs.get("layer_difference", 4),# delta; lower = more layers (default 10)
        corner_threshold=kwargs.get("corner_threshold", 60),# deg; lower = more corner nodes (default 60)

        # --- Curve fitting ---
        length_threshold=kwargs.get("length_threshold", 5), # px; lower = keep short edges (default 10)
        max_iterations=kwargs.get("max_iterations", 10),    # more passes = better curves (default 2)
        splice_threshold=kwargs.get("splice_threshold", 45),# deg; lower = tighter splines (default 45)

        # --- Output ---
        path_precision=kwargs.get("path_precision", 3),     # decimal places in SVG path data
    )
    print(f"[OK] Converted {input_png} → {output_svg}")
    print(f"     Mode: {kwargs.get('mode', 'spline')}")
    print(f"     Speckle filter: {kwargs.get('filter_speckle', 2)} px")
    print(f"     Color precision: {kwargs.get('color_precision', 8)} bits")
    print(f"     Layer difference: {kwargs.get('layer_difference', 4)}")
    print(f"     Corner threshold: {kwargs.get('corner_threshold', 60)}°")
    print(f"     Length threshold: {kwargs.get('length_threshold', 5)} px")
    print(f"     Max iterations: {kwargs.get('max_iterations', 10)}")


def main():
    parser = argparse.ArgumentParser(
        description="High-detail PNG to SVG converter using VTracer."
    )
    parser.add_argument("input", help="Input PNG file")
    parser.add_argument("output", nargs="?", default="output.svg", help="Output SVG file")
    parser.add_argument("--mode", choices=["spline", "polygon"], default="spline",
                        help="Path mode: spline (smooth) or polygon (jagged). Default: spline")
    parser.add_argument("--speckle", type=int, default=2,
                        help="Speckle filter size in px. Lower = more detail. Default: 2")
    parser.add_argument("--precision", type=int, default=8,
                        help="Color precision in bits. Higher = more colors. Default: 8")
    parser.add_argument("--layer-diff", type=int, default=4,
                        help="Layer difference. Lower = more layers. Default: 4")
    parser.add_argument("--corner", type=int, default=60,
                        help="Corner threshold in degrees. Lower = more corners. Default: 60")
    parser.add_argument("--length", type=int, default=5,
                        help="Length threshold in px. Lower = more detail. Default: 5")
    parser.add_argument("--iterations", type=int, default=10,
                        help="Max optimization iterations. Higher = smoother. Default: 10")
    parser.add_argument("--splice", type=int, default=45,
                        help="Splice threshold in degrees. Default: 45")
    parser.add_argument("--preset", choices=["default", "poster", "max"], default="default",
                        help="Quick preset: poster (balanced), max (highest detail)")

    args = parser.parse_args()

    # Apply preset overrides
    kwargs = {
        "mode": args.mode,
        "filter_speckle": args.speckle,
        "color_precision": args.precision,
        "layer_difference": args.layer_diff,
        "corner_threshold": args.corner,
        "length_threshold": args.length,
        "max_iterations": args.iterations,
        "splice_threshold": args.splice,
    }

    if args.preset == "poster":
        # Balanced: good detail, reasonable file size
        kwargs.update({
            "mode": "spline",
            "filter_speckle": 2,
            "color_precision": 7,
            "layer_difference": 6,
            "corner_threshold": 55,
            "length_threshold": 6,
            "max_iterations": 6,
        })
    elif args.preset == "max":
        # Maximum detail: largest file, highest fidelity
        kwargs.update({
            "mode": "spline",
            "filter_speckle": 1,
            "color_precision": 9,
            "layer_difference": 2,
            "corner_threshold": 30,
            "length_threshold": 3,
            "max_iterations": 15,
        })

    convert_high_detail(args.input, args.output, **kwargs)


if __name__ == "__main__":
    main()
