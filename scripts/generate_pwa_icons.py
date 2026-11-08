import zlib
import struct
import math

def create_png(width, height, is_maskable=False):
    # Generates a PNG with indigo/violet/pink gradient and a microphone icon
    raw_data = bytearray()
    
    # Center coords
    cx, cy = width / 2.0, height / 2.0
    r_outer = width * 0.45 if not is_maskable else width * 0.38
    corner_r = width * 0.22 if not is_maskable else width * 0.18

    for y in range(height):
        raw_data.append(0) # Filter byte 0 (None)
        for x in range(width):
            # Gradient t from top-left to bottom-right
            t = (x + y) / (width + height)
            
            # Base gradient color: from #4f46e5 (79, 70, 229) to #db2777 (219, 39, 119)
            bg_r = int(79 + t * (219 - 79))
            bg_g = int(70 + t * (39 - 70))
            bg_b = int(229 + t * (119 - 229))
            
            # Check if within squircle boundary
            dx = abs(x - cx)
            dy = abs(y - cy)
            
            # Distance from rounded box corner
            box_w = cx - corner_r
            box_h = cy - corner_r
            in_rect = True
            if not is_maskable:
                if dx > box_w and dy > box_h:
                    dist = math.sqrt((dx - box_w)**2 + (dy - box_h)**2)
                    if dist > corner_r:
                        in_rect = False
            
            # Draw mic shape in center
            mic_x = abs(x - cx)
            mic_top_y = cy - height * 0.18
            mic_bot_y = cy + height * 0.04
            in_mic = False
            
            # Mic pill body
            pill_w = width * 0.08
            if mic_x <= pill_w and y >= mic_top_y and y <= mic_bot_y:
                in_mic = True
            elif mic_x <= pill_w and y < mic_top_y:
                if math.sqrt(mic_x**2 + (y - mic_top_y)**2) <= pill_w:
                    in_mic = True
            elif mic_x <= pill_w and y > mic_bot_y:
                if math.sqrt(mic_x**2 + (y - mic_bot_y)**2) <= pill_w:
                    in_mic = True
                    
            # Mic cradle arc
            cradle_r = width * 0.14
            dist_c = math.sqrt(mic_x**2 + (y - cy)**2)
            if abs(dist_c - cradle_r) < (width * 0.02) and y >= cy and y <= (cy + cradle_r * 0.7):
                in_mic = True
                
            # Mic stand
            if mic_x <= (width * 0.02) and y >= (cy + cradle_r * 0.7) and y <= (cy + cradle_r * 1.25):
                in_mic = True
            if mic_x <= (width * 0.09) and abs(y - (cy + cradle_r * 1.25)) <= (width * 0.015):
                in_mic = True

            if in_rect:
                if in_mic:
                    raw_data.extend((255, 255, 255, 255))
                else:
                    raw_data.extend((bg_r, bg_g, bg_b, 255))
            else:
                raw_data.extend((0, 0, 0, 0))

    # Pack PNG format
    png = bytearray(b'\x89PNG\r\n\x1a\n')
    
    # IHDR chunk
    ihdr = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    png.extend(struct.pack('>I', len(ihdr)))
    png.extend(b'IHDR')
    png.extend(ihdr)
    png.extend(struct.pack('>I', zlib.crc32(b'IHDR' + ihdr)))
    
    # IDAT chunk
    compressed = zlib.compress(bytes(raw_data), 9)
    png.extend(struct.pack('>I', len(compressed)))
    png.extend(b'IDAT')
    png.extend(compressed)
    png.extend(struct.pack('>I', zlib.crc32(b'IDAT' + compressed)))
    
    # IEND chunk
    png.extend(struct.pack('>I', 0))
    png.extend(b'IEND')
    png.extend(struct.pack('>I', zlib.crc32(b'IEND')))
    
    return bytes(png)

import os
os.makedirs('public', exist_ok=True)

with open('public/pwa-192x192.png', 'wb') as f:
    f.write(create_png(192, 192, is_maskable=False))

with open('public/pwa-512x512.png', 'wb') as f:
    f.write(create_png(512, 512, is_maskable=False))

with open('public/pwa-maskable-512x512.png', 'wb') as f:
    f.write(create_png(512, 512, is_maskable=True))

with open('public/apple-touch-icon.png', 'wb') as f:
    f.write(create_png(180, 180, is_maskable=False))

with open('public/favicon.ico', 'wb') as f:
    f.write(create_png(48, 48, is_maskable=False))

print("Successfully generated all PWA PNG icons in public/")
