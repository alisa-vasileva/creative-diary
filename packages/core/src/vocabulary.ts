import type { ByCategory, IngredientGroup } from "./types";

// Context, material and process come from the "Ideas Factory" brief (deduplicated edition).
// Colour is the prototype's own list; the brief has no colour section.

const list = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

/** The guiding question for each category, from the brief. */
export const categoryQuestions: Partial<ByCategory<string>> = {
  context: "What might the work explore? Which relationships, states, or phenomena could it examine?",
  material: "What could the work be made from or work with? Consider a material’s physical qualities and symbolic associations.",
  process: "What can be done to the material? A physical action can become the work’s central idea.",
};

export const vocabulary: ByCategory<IngredientGroup[]> = {
  context: [
    {
      label: "Connection",
      options: list("Attachment, closeness, dependence, contact, touch, exchange, communication, joining, community, belonging, alliance, union, mediation, resonance, reflection, inheritance, roots, network, symbiosis, synchrony, harmony, solidarity, intimacy, trust, care, place-based bonds, invisible links"),
    },
    {
      label: "Distance",
      options: list("Gap, separation, boundary, barrier, interval, emptiness, isolation, loneliness, absence, dividing line, threshold, periphery, centre, edge, limit, territory, another’s space, personal space, emigration, exile, parting, loss of contact, divided space, invisible wall"),
    },
    {
      label: "Tension",
      options: list("Pressure, resistance, conflict, friction, compression, strain, instability, anxiety, discomfort, fragility, threat, suppression, restriction, struggle, opposition, overload, breaking point, accumulated energy, restrained movement, tipping point, release, catharsis"),
    },
    {
      label: "Movement",
      options: list("Migration, current, flow, displacement, transition, transformation, growth, development, change, shift, rotation, pulsation, drift, sliding, falling, rising, expansion, contraction, acceleration, slowing, repetition, return, circulation, wandering, journey, route, metamorphosis, evolution, decay, rebirth, restoration, becoming"),
    },
    {
      label: "Order",
      options: list("System, structure, organisation, hierarchy, sequence, rhythm, rule, law, discipline, algorithm, symmetry, balance, uniformity, control, measurement, sorting, catalogue, grid, module, pattern, geometry, regulation, instruction, tradition, ritual, habit, routine, predictability, efficiency, normalisation, bureaucracy, system architecture"),
    },
    {
      label: "Chaos",
      options: list("Disorder, chance, unpredictability, uncertainty, entropy, fragmentation, confusion, mistake, malfunction, noise, excess, deformation, mutation, ambiguity, irrationality, absurdity, contradiction, improvisation, spontaneity, loss of control, disorientation, rule-breaking, blurred boundaries, disobedience, coincidence, incompleteness, unfinishedness, unforeseen consequence"),
    },
    {
      label: "Time / Memory",
      options: list("Past, present, future, anticipation, delay, duration, instant, cycles, forgetting, recollection, nostalgia, trace of time, ageing, wear, preservation, disappearance, ephemerality, eternity, transience, deferred action, stopping time, lost time, historical record, family and collective memory, material memory, abandonment, archaeology of everyday life"),
    },
    {
      label: "Body",
      options: list("Skin, breath, pain, pleasure, fatigue, heaviness, lightness, vulnerability, strength, weakness, presence, bodily absence, bodily memory, physical trace, bodily boundaries, limitation, freedom, breathing rhythm, pulse, temperature, sensitivity, numbness, loss of control, embodied experience, invisible sensation"),
    },
    {
      label: "Power",
      options: list("Norm, deviation, submission, freedom, prohibition, permission, censorship, surveillance, privacy, publicness, collective, individuality, identity, exclusion, invisibility, accessibility, privilege, labour, consumption, production, capital, ownership, borders, alienation, social role, gender expectations, protest, collective action, social contract, resource distribution"),
    },
    {
      label: "Ecology",
      options: list("Withering, decomposition, parasitism, predation, ecosystem, seeds, germination, seasonality, drought, flood, erosion, pollution, extinction, adaptation, natural selection, invasiveness, wildness, cultivation, landscape, habitat, interconnection, organic decay, Anthropocene, fragile equilibrium, human–nature interaction"),
    },
  ],
  material: [
    {
      label: "Air",
      options: list("Oxygen, vapour, smoke, fog, mist, airflow, gas, bubble, aerosol, smell, scent, exhaust, invisible atmosphere, air pressure, wind, humidity, cloud"),
    },
    {
      label: "Concrete",
      options: list("Cement, plaster, lime, clay, sand, stone, marble, granite, chalk, brick, stucco, ceramic, porcelain, glass, quartz, mica, graphite, coal, salt, earth, gravel, pebbles, metal ore, oxide, mineral powder, construction waste, building dust, concrete fragments"),
    },
    {
      label: "Hair",
      options: list("Fur, human nails, scales, skin, tendons, bones, teeth, horns, silk, wool yarn, linen, hemp fibre, jute, sisal, raffia, felt, shed hair, hair cloth, fibrous dust"),
    },
    {
      label: "Rubber",
      options: list("Latex, silicone, caoutchouc, elastomer, polyurethane, PVC, polyethylene, film, plastic, acrylic, foam, sponge, neoprene, stretch fabric, spandex, inflatable materials, air chambers, elastic membranes, stretch bands, adhesive polymers, thermoplastic, recycled polymers"),
    },
    {
      label: "Water",
      options: list("Ice, snow, meltwater, salt water, seawater, rainwater, ink, paint, oil, melted wax, soap, gel, syrup, resin, glue, glycerine, milk, mud, silt, liquid clay, pigment suspension, liquid metal, condensation, droplets, wastewater"),
    },
    {
      label: "Ink",
      options: list("India ink, watercolour, gouache, acrylic and oil paint, pigment, graphite, pastel, dye, plant dyes, rust, soot, soil, coffee grounds, tea, beet juice, botanical ink, carbon paper, toner, printing ink, stamp ink, fingerprints, shoe prints"),
    },
    {
      label: "Wood",
      options: list("Birch, pine, oak, branches, roots, bark, wood shavings, sawdust, veneer, plywood, dry or fresh leaves, flowers, petals, seeds, fruit, cones, moss, lichen, straw, reed, cane, bamboo, cork, tree resin, plant fibres, dry stems"),
    },
    {
      label: "Metal",
      options: list("Iron, steel, aluminium, copper, brass, bronze, tin, lead, silver, gold, wire, metal mesh, foil, sheet metal, chains, nails, staples, springs, metal shavings, metal dust, rusted metal, metal filings"),
    },
    {
      label: "Paper",
      options: list("Cardboard, corrugated cardboard, tracing paper, tissue paper, newsprint, books, pages, fabric, cotton, organza, tulle, mesh, burlap, lace, gauze, bandages, thread, yarn, rope, cord, ribbons, strings, old towels, clothing, textile waste"),
    },
    {
      label: "Beeswax",
      options: list("Honey, gelatine, eggshell, egg white, milk casein, algae, agar, mycelium, fungi, feathers, compost, bioplastic, cellulose, paper pulp"),
    },
    {
      label: "Light",
      options: list("Shadow, reflection, glint, coloured lighting, ultraviolet, projection, laser beam, sound, noise, vibration, echo, voice recording, digital image, pixels, data, code, electric current, electromagnetic field, thermal radiation, screen glow, static electricity"),
    },
    {
      label: "Found objects",
      options: list("Mirrors, bottles, jars, bags, cables, keys, locks, buttons, zips, fasteners, toys, packaging, labels, receipts, invoices, photographs, envelopes, letters, medical bandages, household sponges, plastic lids, old tools, broken objects, furniture fragments"),
    },
  ],
  process: [
    {
      label: "Destruction",
      options: list("Slice, tear, break, split, crush, crumble, grind, dismantle, cleave, delaminate, sever, carve out, burn away, punch through, pierce, perforate, erase, remove, deconstruct, disconnect, untangle, scrape off, strip back, snap apart"),
    },
    {
      label: "Suspend",
      options: list("Hold, fasten, tie, stretch taut, hang on threads, balance, prop up, support, fix in place, clamp, connect with supports, stretch between points, hang on hooks, build a frame, install braces, suspend from hair, attach with a magnet, hold by friction"),
    },
    {
      label: "Expand",
      options: list("Inflate, blow up, stretch, spread apart, unfold, unfurl, loosen, enlarge, open out, branch, lengthen, proliferate, germinate, melt, dissolve, blur, evaporate, moisten, saturate, fill, increase pressure, create volume, turn a flat surface into volume"),
    },
    {
      label: "Knot",
      options: list("Tie, interweave, braid, knit, sew, stitch, gather, join, fasten, mesh together, reconnect, bind around, create a network, make loops, tighten knots, form chains, tangle, twist together, join different materials, splice, extend, stitch with gaps"),
    },
    {
      label: "Accumulate",
      options: list("Layer, build up, collect, pile up, stack, mount, glue on, add, attach, pour in, fill, pour over, dust with, surround, gather fragments, create sediment, accumulate traces, apply repeatedly, fill gaps, create excess, assemble a collection, combine remnants"),
    },
    {
      label: "Remove",
      options: list("Take out, extract, scoop out, blow away, wash away, weather away, evaporate, dry out, empty, clean, filter, fade, dissolve, reduce, diminish, thin, lighten, exhaust, free space, leave voids, strip layers, thin until translucent"),
    },
    {
      label: "Transform",
      options: list("Turn over, roll, twist, compress, flatten, arrange, group, sort, align, organise, repeat, line up, form a grid or module, accordion-fold, crease, trim to shape, heat, cool, freeze, dry, soften, harden, crystallise, deform, deflate, erode, colour, bleach, oxidise, patinate, polish, scratch, sand, cast, mould, sculpt, wind or coil around, swaddle, cover, stretch over, clad, line, close, seal, make airtight, camouflage, hide, isolate, protect, frame, envelop, paste over, wrap in layers, create a shell, conceal a surface, cover with transparent film, partly cover, leave an opening"),
    },
    {
      label: "Imprint",
      options: list("Stamp, copy, transfer an image, emboss, scratch, engrave, draw, write, apply, smear, roll over, photograph, scan, trace, record a mark, make a cast, take a mould, create a negative, leave a fingerprint, preserve a surface impression, reveal a hidden image, reproduce, duplicate, clone, serialise, alternate, create rhythm, repeat with variations, make a sequence, reproduce an error, repeat until destruction, increase frequency, create an endless loop, return to the original form"),
    },
  ],
  colour: [
    {
      label: "Luminous colours",
      options: list("Acid yellow, electric blue, hot pink, signal orange, ultraviolet, toxic green, phosphor white, infrared red"),
    },
    {
      label: "Earth and mineral",
      options: list("Lichen green, rust red, clay pink, ochre, charcoal, bone white, copper green, ash grey, mineral blue"),
    },
    {
      label: "Atmospheric",
      options: list("Fog lilac, rain blue, smoke grey, dawn peach, storm violet, cloud white, twilight indigo, sun-faded yellow"),
    },
    {
      label: "Combinations",
      options: list("Acid yellow + bruised plum, moss green + shell pink, rust + ultramarine, smoke + coral, ink blue + chalk, copper + lilac, black + translucent white, red + algae green"),
    },
  ],
};
