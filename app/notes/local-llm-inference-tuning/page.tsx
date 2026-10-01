import type { Metadata } from "next";
import Link from "next/link";
import "../notes.css";

export const metadata: Metadata = {
  title: "What actually fits on 16 GB - Victor Arsenie",
  description:
    "Running two coding models on one consumer GPU: a 27B dense and a 35B mixture-of-experts, both fully GPU-resident, with vision. The numbers, and the 4x slowdown that turned out to be a missing metadata field.",
};

export default function LocalLlmNotesPage() {
  return (
    <main className="note-band">
      <article className="note">
        <Link className="note-back" href="/">
          &larr; Back to portfolio
        </Link>
        <header className="note-head">
          <p className="note-eyebrow">Notes / Local inference</p>
          <h1 className="note-title">What Actually Fits on 16 GB</h1>
          <p className="note-deck">
            I run two coding models on one graphics card — a 27B dense model and a 35B
            mixture-of-experts, both fully GPU-resident, with vision. These are the measured
            numbers, and the four-times slowdown that turned out to be one missing metadata field.
          </p>
        </header>

        <section className="note-section">
          <h2>1. The number everyone quotes is the one you never work in</h2>
          <p>
            Every local-model benchmark reports tokens per second at zero context, on the first
            token generated. That number is real. It is also the only configuration you never
            actually work in. The moment a session carries a repository, the resource you are
            managing stops being the model and becomes the memory budget — and on a 16 GB card,
            that budget is contested from the first token.
          </p>
          <p>Three limits stack, and they are not independent:</p>
          <ul>
            <li>
              <strong>16 GB of VRAM, of which about 1,415 MiB is already spent.</strong> Windows,
              the compositor, and hardware-accelerated browser tabs hold that before a single
              weight loads. It is not a process you can kill. Usable budget: roughly 14.9 GB.
            </li>
            <li>
              <strong>32 GB of system RAM.</strong> Whatever does not fit on the GPU has to live
              here. Whatever does not fit here goes to disk.
            </li>
            <li>
              <strong>A SATA SSD</strong> at roughly 500 MB/s sequential, and far worse at random
              reads. This is the real ceiling, and everything below follows from it.
            </li>
          </ul>
          <p>
            The GPU was never the scarce resource. The bus into it is — and that turns out to
            matter more than which model you pick.
          </p>
        </section>

        <section className="note-section">
          <h2>2. Two models, two jobs</h2>
          <div className="note-table-wrap">
            <table className="note-table">
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Role</th>
                  <th>Context</th>
                  <th>Speed</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>27B dense</td>
                  <td>real multi-file edits, vision</td>
                  <td>128K</td>
                  <td>54 t/s</td>
                </tr>
                <tr>
                  <td>35B MoE (3B active)</td>
                  <td>fast, well-scoped work</td>
                  <td>256K</td>
                  <td>175 t/s</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            I run two models, not one, and the routing between them is the design. A 35B
            mixture-of-experts — about 35.5B total parameters but only 3B active per token — holds
            175 tokens per second across a 256K window. That is the fast path for well-scoped
            work. A 27B dense model carries roughly nine times the compute per token, and it is
            what does the real project edits: the multi-file changes where the model has to hold a
            whole section in view. It runs at 54 t/s across 128K.
          </p>
          <p>
            The dense model is not a fallback for the fast one. I watched the 3B-active MoE break
            a hero section during a fifteen-file change — not because it generated bad code, but
            because three billion active parameters is not enough working memory to hold the whole
            picture while editing blind. The dense model ran the same prompts and shipped a
            complete, working rework. That is the ceiling, stated plainly, and it is why the split
            exists.
          </p>
        </section>

        <section className="note-section">
          <h2>3. Vision for free, by giving up the tempting default</h2>
          <p>
            The conventional way to add image input to a local model is to offload the vision
            projector to the GPU. That spends the scarcest resource — VRAM — on the encoder, and
            it shrinks the context you can hold at the same time.
          </p>
          <p>
            Keeping the encoder on the CPU costs 3.2% throughput and zero VRAM, and it works at
            the full 128K window:
          </p>
          <div className="note-table-wrap">
            <table className="note-table">
              <thead>
                <tr>
                  <th>Configuration</th>
                  <th>Speed</th>
                  <th>VRAM cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>27B, no vision</td>
                  <td>54.3 t/s</td>
                  <td>baseline</td>
                </tr>
                <tr>
                  <td>27B + CLIP encoder, CPU-resident</td>
                  <td>52.6 t/s</td>
                  <td>0 MB</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            That is not a compromise; it is the better configuration. The whole 16 GB stays
            available for language layers. The honest cost: the flag that pins the encoder to the
            CPU also disables prefix-cache reuse, so repeated prefixes are re-prefilled on vision
            runs. Worth knowing, not worth the VRAM.
          </p>
        </section>

        <section className="note-section">
          <h2>4. The 4× slowdown that was one missing field</h2>
          <p>
            A smaller quantization of the 35B MoE ran <em>four times slower</em> than a larger
            one. Not marginally. IQ2_M at 128K managed 44 tokens per second; IQ3_XXS — the same
            model at 15.8 GB — ran at about 170.
          </p>
          <p>
            The obvious theory was wrong. <code>nvidia-smi</code> showed 97% VRAM used with about
            3 GB unaccounted for, and a load warning said not all layers had been offloaded to the
            GPU as requested. The natural explanation — a stray background process holding memory
            — did not survive <code>--query-compute-apps</code>, which showed only the one server.
            Something was allocating memory that should not have been.
          </p>
          <p>
            It was the KV cache. The 35B MoE architecture has 40 layers, but only 10 of them
            allocate a KV cache — the other 30 are Gated DeltaNet layers, a linear-attention
            variant that keeps no per-token key/value state. The IQ2_M file had been built by a
            tool that did not carry that layer map into the GGUF metadata, so llama.cpp did what it
            does when it has no layer map: it allocated KV cache for all 40 layers.
          </p>
          <div className="note-table-wrap">
            <table className="note-table">
              <thead>
                <tr>
                  <th>Blob</th>
                  <th>KV layers</th>
                  <th>KV @128K</th>
                  <th>Over budget</th>
                  <th>Speed</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>IQ3_XXS</td>
                  <td>10</td>
                  <td>720 MiB</td>
                  <td>1,202 MiB</td>
                  <td>170 t/s</td>
                </tr>
                <tr>
                  <td>IQ2_M (bad blob)</td>
                  <td>40</td>
                  <td>2,453 MiB</td>
                  <td>1,173 MiB</td>
                  <td>44 t/s</td>
                </tr>
                <tr>
                  <td>IQ2_M (bartowski build)</td>
                  <td>10</td>
                  <td>720 MiB</td>
                  <td>~0</td>
                  <td>178 t/s</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The same model, at the same quantization, ran four times slower because of a missing
            layer map in the file&rsquo;s metadata. Fixing it did not require a faster GPU — it
            required reading the offload line in the load log, noticing that forty layers had been
            given a cache only ten of them needed, and switching to a build that carried the
            architecture description.
          </p>
          <p>
            If you are running a hybrid linear-attention model from a GGUF a third-party tool
            produced, and your speed is inexplicably low, count how many layers got a KV cache
            before you buy anything.
          </p>
        </section>

        <section className="note-section">
          <h2>5. The one that didn&rsquo;t fit</h2>
          <p>
            A 125B model — 6B active — beat the 27B on all twelve shared benchmarks and was the
            obvious candidate for migration work. I downloaded it, tuned the offload, and threw it
            out.
          </p>
          <p>
            It ran. It ran at 3 to 12 tokens per second. The reason is the third constraint from
            the top: the weights are 76 GB, RAM is 32 GB, and every token forced the working set
            to stream across a SATA link. The model was I/O-bound, not compute-bound — during
            generation, RAM sat at 99–100% while the page cache evicted and re-faulted
            continuously. Published figures of 10–15 t/s for this model assume NVMe or 64 GB of
            RAM. On this machine it was a negative result, and the honest way to report it is as
            one: the best model on paper was unusable in practice, and the bottleneck was a
            500 MB/s disk.
          </p>
        </section>

        <section className="note-section">
          <h2>6. The one that was fast instead of deep</h2>
          <p>
            The same question about a 74 KB research file, put to the 27B dense model and to a 20B
            model that runs roughly five times faster per token.
          </p>
          <div className="note-table-wrap">
            <table className="note-table">
              <thead>
                <tr>
                  <th>Same task</th>
                  <th>20B MoE</th>
                  <th>27B dense</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Wall clock</td>
                  <td>27.7 s</td>
                  <td>318 s</td>
                </tr>
                <tr>
                  <td>Decode speed</td>
                  <td>118 t/s</td>
                  <td>21 t/s</td>
                </tr>
                <tr>
                  <td>Flash-Next size</td>
                  <td>76 GB</td>
                  <td>76 GB + 51B n-gram table</td>
                </tr>
                <tr>
                  <td>Metadata bug</td>
                  <td>not mentioned</td>
                  <td>mechanism explained</td>
                </tr>
                <tr>
                  <td>Open items</td>
                  <td>generic filler</td>
                  <td>PR numbers, file paths</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The 20B finished 11.5 times faster on the clock and produced about a third of the
            substance. Its one concrete figure came out the wrong shape — it gave 76 GB as the
            size of the model, when the point is 76 GB of weights on top of a 51-billion-entry
            lookup table, which is the half of the problem that makes it unusable here. It never
            mentioned the metadata bug. Its open questions were generic filler; the 27B&rsquo;s
            were specific enough to check — pull-request numbers and file paths.
          </p>
          <p>
            The 20B is not a bad model. For short lookups and simple file questions it is the
            right tool, and it handles tool-calling well. But its speed carries a cost that tokens
            per second does not show: it spends thousands of thinking tokens before a short
            answer, and once a task needs depth, the depth is not there. On the work that ends up
            in the research file, the slow model is the cheap one — it is the one whose output
            does not have to be redone.
          </p>
        </section>

        <section className="note-section">
          <h2>7. The finding that isn&rsquo;t about hardware</h2>
          <p>The most useful thing I learned had nothing to do with VRAM.</p>
          <p>
            Both models are fast, and both are correct when they stop — and both have trouble
            stopping. The 35B MoE, on a definite task, would produce correct code and then spend
            thousands of hidden reasoning tokens looping, double-drafting, and re-verifying. At
            175 t/s that is 20 to 90 seconds of dead air for work already done.
          </p>
          <p>
            I tried the settings people suggest. Lowering temperature to 0.7 or 0.6 did not reduce
            the variance — across runs, total tokens ranged from 788 to 5,578. A &ldquo;low
            reasoning effort&rdquo; flag trimmed about 27%, which is not enough. What worked was a
            hard cap: a 4,096-token reasoning budget. The model&rsquo;s thinking is now cut
            mid-sentence at exactly 4,096 tokens, and worst-case dead air fell to about 23 seconds.
          </p>
          <p>
            Then there is the shape that cap does not fix. The 27B dense model handles a contained
            bug in about 1,500 to 1,800 tokens, focused and correct. Asked to find a bug in code
            that had none, it verified the code was correct — and then looped for roughly two
            minutes, three runs out of three, manufacturing a change so it had something to report.
            A false premise gives the model no stopping signal.
          </p>
          <p>
            Both failures are the same family. A model asked for a definite answer, or handed a
            premise that is false, will keep working until it invents a stop. The fix is not more
            compute — it is prompt framing plus a hard reasoning budget. That is the single most
            useful result here, and it costs nothing.
          </p>
        </section>

        <section className="note-section">
          <h2>8. What local actually buys</h2>
          <p>
            Local is not faster than a hosted model, and it would be dishonest to sell it that way.
            Against the free tier I was comparing, decode ran 24.5 to 57.8 tokens per second —
            comparable to, sometimes better than, the 53 here.
          </p>
          <p>
            What local buys is everything else. The free tier is rate-limited: roughly 200 requests
            a day, tool calls capped, a usage meter that compacts the conversation at 70% and
            blocks after a few compactions, and no published reset window. Its free models rotate
            and disappear by design, and when I sent it an image, the vision endpoint returned 503
            — which is why the local encoder above is not a nice-to-have. And it trains on what you
            send.
          </p>
          <p>
            The local setup has no quota, no training exposure, no model that vanishes next month,
            and it runs with the network unplugged. That is the trade: comparable speed, none of
            the terms.
          </p>
        </section>

        <section className="note-section">
          <h2>9. Method</h2>
          <p>
            Every number here was taken the same way: fixed context length and fixed token counts,
            repeated runs, with <code>nvidia-smi</code> and the server&rsquo;s own load log for
            VRAM rather than estimates. Where an earlier run disagreed with a later one, the later
            run is quoted — the speculative-decoding figures in particular were first recorded as a
            failure at 128K, and only understood later as a memory-pressure limit, not a broken
            implementation. Speculative decoding now buys 57% more throughput, but only at 64K,
            where there is 2.4 GB of headroom; at 128K it thrashes and loses.
          </p>
        </section>

        <footer className="note-foot">
          <p>
            Measured on one machine: AMD Ryzen 7 5700X, 32 GB DDR4-3200 CL14 RAM, an RTX 5070 Ti
            with 16 GB VRAM, and a SATA SSD. Models served through llama.cpp; numbers from the
            server&rsquo;s load log and <code>nvidia-smi</code>.
          </p>
        </footer>
      </article>
    </main>
  );
}
